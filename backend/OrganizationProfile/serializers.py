from rest_framework import serializers
from .models import OrganizationProfile


class OrganizationProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = OrganizationProfile
        fields = "__all__"
        read_only_fields = ["user"]