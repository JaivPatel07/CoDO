from rest_framework import serializers
from .models import OrganizationProfile


class OrganizationProfileSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source="user.username", required=False)

    class Meta:
        model = OrganizationProfile
        exclude = ["user"]