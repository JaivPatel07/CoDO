from rest_framework import serializers
from datetime import datetime
from .models import CollabrationEventPost,JoinRequestLog


class FetchPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollabrationEventPost
        fields = "__all__"


class AddPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollabrationEventPost
        fields = "__all__"
        read_only_fields = ["owner", "post_date","status"]

    def validate_title(self, value):
        value = value.strip()

        if len(value) < 5:
            raise serializers.ValidationError(
                "Title must be at least 5 characters long."
            )

        return value

    def validate_description(self, value):
        value = value.strip()

        if len(value) < 20:
            raise serializers.ValidationError(
                "Description must be at least 20 characters long."
            )

        return value


    def validate_event_url(self, value):
        if value and not value.startswith(("http://", "https://")):
            raise serializers.ValidationError(
                "Enter a valid URL."
            )
        return value

    def validate(self, attrs):
        start = datetime.combine(
            attrs["start_date"],
            attrs["start_time"]
        )

        end = datetime.combine(
            attrs["end_date"],
            attrs["end_time"]
        )

        if end <= start:
            raise serializers.ValidationError({
                "end_date": "End date/time must be after start date/time."
            })

        
        return attrs
        
            

class JoinRequestLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinRequestLog
        fields = "__all__"
