import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Count, Q, Sum
from django.db.models.functions import TruncMonth
from django.utils import timezone
from cloudStorage.Cloudinary import upload_image
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from datetime import date

from .models import Event, EventRegistrationClick
from .serializers import EventSerializer
from network.models import OrganizationFollow
from notification.models import NotificationStore
from OrganizationProfile.models import OrganizationProfileView

class EventListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        queryset = Event.objects.select_related("organization").all().order_by('-created_at')

        following = request.query_params.get('following')
        if following and following.lower() == "true":
            if not request.user.is_authenticated:
                return Response(
                    {"error": "Authentication is required."},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            if not request.user.is_student:
                return Response(
                    {"error": "Only students can view followed organization events."},
                    status=status.HTTP_403_FORBIDDEN
                )
            followed_org_ids = OrganizationFollow.objects.filter(
                student=request.user
            ).values_list("organization_id", flat=True)
            queryset = queryset.filter(organization_id__in=followed_org_ids)

        # Filter by organization username
        org_username = request.query_params.get('org')
        if org_username:
            queryset = queryset.filter(organization__username=org_username)

        # Filter by category
        category = request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__iexact=category)

        # Filter by date
        date_str = request.query_params.get('date')
        if date_str:
            queryset = queryset.filter(event_date=date_str)

        # Search query
        search_query = request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(short_description__icontains=search_query) |
                Q(detailed_description__icontains=search_query) |
                Q(tags__icontains=search_query) |
                Q(category__icontains=search_query)
            )

        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Only organization accounts should be able to create events
        if request.user.is_student:
            return Response(
                {"error": "Students are not authorized to create events."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Convert QueryDict to a plain dict so we can set dict/list values properly
        data = {key: request.data[key] for key in request.data}

        # Parse custom_dates JSON string → Python dict for JSONField
        custom_dates_val = request.data.get('custom_dates')
        if custom_dates_val:
            try:
                parsed = json.loads(custom_dates_val)
                data['custom_dates'] = parsed
            except (json.JSONDecodeError, TypeError):
                data['custom_dates'] = {}
        else:
            data['custom_dates'] = {}

        # Handle banner image upload to Cloudinary
        image_file = request.FILES.get('banner_image')
        if image_file:
            try:
                uploaded_url = upload_image(image_file)
                data['banner_image'] = uploaded_url
            except Exception as e:
                return Response(
                    {"error": f"Image upload failed: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = EventSerializer(data=data)
        if serializer.is_valid():
            event = serializer.save(organization=request.user)
            followers = OrganizationFollow.objects.filter(
                organization=request.user,
                student__is_active=True
            ).select_related("student")

            notifications = [
                NotificationStore(
                    sender=request.user,
                    reciver=follow.student,
                    notification_type="event",
                    message=f"{request.user.username} posted a new event: {event.title}",
                    event_id=event.id,
                    is_read=False,
                )
                for follow in followers
            ]
            created_notifications = NotificationStore.objects.bulk_create(notifications)

            channel_layer = get_channel_layer()
            if channel_layer:
                for notification in created_notifications:
                    sanitized_username = notification.reciver.username.replace("@", "_at_").replace("+", "_plus_")
                    async_to_sync(channel_layer.group_send)(
                        f"user_{sanitized_username}",
                        {
                            "type": "notification_message",
                            "id": notification.id,
                            "senderfullname": request.user.username,
                            "senderusername": request.user.username,
                            "sender_profile_url": f"/organization/{request.user.username}/profile",
                            "message": notification.message,
                            "notification_type": notification.notification_type,
                            "created_at": str(notification.created_at),
                            "notification_post_id": notification.event_id,
                            "event_id": notification.event_id,
                            "is_read": notification.is_read,
                        }
                    )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventDetailUpdateDeleteView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_object(self, pk):
        try:
            return Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return None

    def get(self, request, pk):
        event = self.get_object(pk)
        if not event:
            return Response(
                {"error": "Event not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        event = self.get_object(pk)
        if not event:
            return Response(
                {"error": "Event not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check permissions: only creator organization can edit
        if request.user.is_student or event.organization != request.user:
            return Response(
                {"error": "You do not have permission to modify this event."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Convert QueryDict to a plain dict so we can set dict/list values properly
        data = {key: request.data[key] for key in request.data}

        # Parse custom_dates JSON string → Python dict for JSONField
        custom_dates_val = request.data.get('custom_dates')
        if custom_dates_val:
            try:
                parsed = json.loads(custom_dates_val)
                data['custom_dates'] = parsed
            except (json.JSONDecodeError, TypeError):
                data['custom_dates'] = {}
        else:
            data['custom_dates'] = {}

        # Handle new banner image upload to Cloudinary
        image_file = request.FILES.get('banner_image')
        if image_file:
            try:
                uploaded_url = upload_image(image_file)
                data['banner_image'] = uploaded_url
            except Exception as e:
                return Response(
                    {"error": f"Image upload failed: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # No new file uploaded — remove empty banner_image string to keep existing value
            if not data.get('banner_image'):
                data.pop('banner_image', None)

        serializer = EventSerializer(event, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        event = self.get_object(pk)
        if not event:
            return Response(
                {"error": "Event not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check permissions: only creator organization can delete
        if request.user.is_student or event.organization != request.user:
            return Response(
                {"error": "You do not have permission to delete this event."},
                status=status.HTTP_403_FORBIDDEN
            )

        event.delete()
        return Response(
            {"message": "Event deleted successfully."},
            status=status.HTTP_200_OK
        )

class TrackRegistrationClickView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response(
                {"error": "Event not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Increment the click count
        event.registration_link_clicks += 1
        event.save(update_fields=['registration_link_clicks'])
        EventRegistrationClick.objects.create(
            event=event,
            clicked_by=request.user if request.user.is_authenticated else None
        )
        
        return Response({"success": True, "clicks": event.registration_link_clicks}, status=status.HTTP_200_OK)


class OrganizationDashboardAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.is_student:
            return Response(
                {"error": "Only organization accounts can view dashboard analytics."},
                status=status.HTTP_403_FORBIDDEN
            )

        organization = request.user
        now = timezone.now()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        previous_month_end = current_month_start
        previous_month_start = _add_months(current_month_start.date(), -1)
        chart_start = _add_months(current_month_start.date(), -11)

        total_profile_views = OrganizationProfileView.objects.filter(
            organization=organization
        ).count()
        current_profile_views = OrganizationProfileView.objects.filter(
            organization=organization,
            viewed_at__gte=current_month_start
        ).count()
        previous_profile_views = OrganizationProfileView.objects.filter(
            organization=organization,
            viewed_at__gte=previous_month_start,
            viewed_at__lt=previous_month_end
        ).count()

        followers_qs = OrganizationFollow.objects.filter(organization=organization)
        total_followers = followers_qs.count()
        current_followers = followers_qs.filter(created_at__gte=current_month_start).count()

        events_qs = Event.objects.filter(organization=organization)
        total_events = events_qs.count()
        current_events = events_qs.filter(created_at__gte=current_month_start).count()

        registration_total = events_qs.aggregate(
            total=Sum("registration_link_clicks")
        )["total"] or 0
        current_registration_clicks = EventRegistrationClick.objects.filter(
            event__organization=organization,
            clicked_at__gte=current_month_start
        ).count()

        profile_views_by_month = _month_count_map(
            OrganizationProfileView.objects.filter(
                organization=organization,
                viewed_at__gte=chart_start
            ),
            "viewed_at"
        )
        followers_by_month = _month_count_map(
            followers_qs.filter(created_at__gte=chart_start),
            "created_at"
        )
        registrations_by_month = _month_count_map(
            EventRegistrationClick.objects.filter(
                event__organization=organization,
                clicked_at__gte=chart_start
            ),
            "clicked_at"
        )

        months = []
        for index in range(12):
            month_date = _add_months(chart_start, index)
            key = month_date.strftime("%Y-%m")
            months.append({
                "key": key,
                "label": month_date.strftime("%b %Y"),
                "profile_views": profile_views_by_month.get(key, 0),
                "followers": followers_by_month.get(key, 0),
                "registrations": registrations_by_month.get(key, 0),
            })

        upcoming_events = list(
            events_qs.filter(event_date__gte=now.date())
            .order_by("event_date", "start_time")
            .values("id", "title", "event_date", "location", "registration_link_clicks")[:5]
        )

        return Response({
            "cards": {
                "profile_views": {
                    "total": total_profile_views,
                    "current_month": current_profile_views,
                    "previous_month": previous_profile_views,
                    "monthly_growth_percent": _growth_percent(current_profile_views, previous_profile_views),
                },
                "followers": {
                    "total": total_followers,
                    "current_month": current_followers,
                },
                "events_hosted": {
                    "total": total_events,
                    "current_month": current_events,
                },
                "registrations": {
                    "total": registration_total,
                    "current_month": current_registration_clicks,
                },
            },
            "chart": months,
            "upcoming_events": upcoming_events,
        }, status=status.HTTP_200_OK)


def _add_months(value, months):
    if hasattr(value, "date"):
        value = value.date()
    month = value.month - 1 + months
    year = value.year + month // 12
    month = month % 12 + 1
    return date(year, month, 1)


def _month_count_map(queryset, date_field):
    return {
        item["month"].strftime("%Y-%m"): item["count"]
        for item in queryset.annotate(month=TruncMonth(date_field))
        .values("month")
        .annotate(count=Count("id"))
    }


def _growth_percent(current, previous):
    if previous == 0:
        return 100 if current > 0 else 0
    return round(((current - previous) / previous) * 100, 1)
