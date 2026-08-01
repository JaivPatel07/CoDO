from rest_framework import serializers
from .models import NotificationStore


class NotificationSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source="sender.username", read_only=True)

    class Meta:
        model = NotificationStore
        fields = "__all__"