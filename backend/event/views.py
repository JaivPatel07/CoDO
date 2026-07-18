import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from cloudStorage.Cloudinary import upload_image

from .models import Event
from .serializers import EventSerializer

class EventListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        queryset = Event.objects.all().order_by('event_date', 'start_time')

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

        data = request.data.copy()
        
        # Parse custom_dates JSON if present
        custom_dates_val = request.data.get('custom_dates')
        if custom_dates_val:
            try:
                data['custom_dates'] = json.loads(custom_dates_val)
            except Exception:
                pass

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
            serializer.save(organization=request.user)
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

        data = request.data.copy()

        # Parse custom_dates JSON if present
        custom_dates_val = request.data.get('custom_dates')
        if custom_dates_val:
            try:
                data['custom_dates'] = json.loads(custom_dates_val)
            except Exception:
                pass

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
        
        return Response({"success": True, "clicks": event.registration_link_clicks}, status=status.HTTP_200_OK)
