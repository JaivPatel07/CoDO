from rest_framework import serializers
from .models import Event
from OrganizationProfile.models import OrganizationProfile

class EventSerializer(serializers.ModelSerializer):
    organization_username = serializers.CharField(source="organization.username", read_only=True)
    organization_name = serializers.SerializerMethodField(read_only=True)
    organization_logo = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "organization",
            "organization_username",
            "organization_name",
            "organization_logo",
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
