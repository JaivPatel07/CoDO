from rest_framework import serializers
from .models import Event
from OrganizationProfile.models import OrganizationProfile

class EventSerializer(serializers.ModelSerializer):
    organization_username = serializers.CharField(source="organization.username", read_only=True)
    organization_name = serializers.SerializerMethodField(read_only=True)
    organization_logo = serializers.SerializerMethodField(read_only=True)
    profile_views = serializers.IntegerField(read_only=True, default=0)
    interested_count = serializers.IntegerField(read_only=True, default=0)
    is_interested = serializers.SerializerMethodField(read_only=True)
    publication_status = serializers.SerializerMethodField(read_only=True)
    event_mode = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "organization",
            "organization_username",
            "organization_name",
            "organization_logo",
            "profile_views",
            "interested_count",
            "is_interested",
            "publication_status",
            "event_mode",
            "title",
            "banner_image",
            "short_description",
            "detailed_description",
            "event_date",
            "end_date",
            "start_time",
            "end_time",
            "registration_deadline",
            "custom_dates",
            "registration_link",
            "registration_link_clicks",
            "location",
            "map_link",
            "category",
            "tags",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["organization"]

    def get_organization_name(self, obj):
        try:
            profile = OrganizationProfile.objects.get(user=obj.organization)
            return obj.organization.username
        except Exception:
            return obj.organization.username

    def get_organization_logo(self, obj):
        try:
            profile = OrganizationProfile.objects.get(user=obj.organization)
            return profile.profile_pic
        except Exception:
            return ""

    def get_publication_status(self, obj):
        return getattr(obj, "publication_status", "published")

    def get_event_mode(self, obj):
        location = (obj.location or "").lower()
        if "hybrid" in location:
            return "Hybrid"
        if "online" in location or "virtual" in location or "remote" in location:
            return "Online"
        return "Offline"

    def get_is_interested(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated or not request.user.is_student:
            return False
        return obj.interests.filter(student=request.user).exists()
