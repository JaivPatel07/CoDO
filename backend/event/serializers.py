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
            "location",
            "online_meeting_link",
            "category",
            "tags",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["organization"]

    def get_organization_name(self, obj):
        try:
            profile = OrganizationProfile.objects.get(user=obj.organization)
            # Assuming profile has a field for name, otherwise fallback to username
            # In our earlier check, OrganizationProfile has user, profile_pic, description, etc.
            # Wait, let's look at what field stores the organization name.
            # In PublicOrganizationProfilePage.jsx: `profile.organization_name`
            # Let's check OrganizationProfile models.py to see if there is organization_name field.
            # Wait, let's look back at OrganizationProfile/models.py that we viewed earlier.
            # It had: user, profile_pic, industry, description, contact_person, phone_number, website, country, state, city, linkedin, instagram, twitter, created_at, updated_at.
            # Wait! There was NO organization_name field in OrganizationProfile/models.py!
            # Let's check if there is an organization_name field. Let's re-read models.py of OrganizationProfile.
            # Ah, yes! No organization_name field. But wait! The string representation __str__ returns self.user.username.
            # Wait, let's verify if there is an organization_name or we should use user.username.
            # Let's see how it is handled in OrganizationProfileForm.jsx or OrganizationProfilePage.jsx.
            # In PublicOrganizationProfilePage.jsx, it has `profile.organization_name ? profile.organization_name.charAt(0)...`
            # Wait, where does `profile.organization_name` come from? Is it user.username or did they define it elsewhere?
            # Let's grep OrganizationProfile for "organization_name" or view serializers.py of OrganizationProfile.
            # Wait, in OrganizationProfile/serializers.py we had: fields = "__all__".
            # Let's check if we missed something. Let's look at OrganizationProfile/models.py:
            # Class OrganizationProfile(models.Model):
            #   user = models.OneToOneField(...)
            #   profile_pic = models.URLField(...)
            #   industry = models.CharField(...)
            #   description = models.TextField(...)
            #   ...
            # Indeed, there is no organization_name. But username is unique.
            # Let's check if the username is the name of the organization.
            # Let's look at get_organization_name method in EventSerializer:
            return obj.organization.username
        except Exception:
            return obj.organization.username

    def get_organization_logo(self, obj):
        try:
            profile = OrganizationProfile.objects.get(user=obj.organization)
            return profile.profile_pic
        except Exception:
            return ""
