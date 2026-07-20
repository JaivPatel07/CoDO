from rest_framework import serializers
from datetime import datetime
from .models import CollabrationPost


class FetchPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollabrationPost
        fields = "__all__"


class AddPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollabrationPost
        fields = "__all__"
        read_only_fields = ["user", "post_date","status"]

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

    def validate_team_size(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Team size must be greater than 0."
            )
        return value

    def validate_roles(self, value):
        if not value:
            raise serializers.ValidationError(
                "Select at least one role."
            )
        return value

    def validate_skills(self, value):
        if not value:
            raise serializers.ValidationError(
                "Select at least one skill."
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

        if attrs["members_required"] > attrs["team_size"]:
            raise serializers.ValidationError({
                "members_required": "members_required cannot exceed team size."
            })
        
        return attrs
        

    def create(self, validated_data):
        if validated_data["members_required"] >= validated_data["team_size"]:
            validated_data["status"] = False
        else:
            validated_data["status"] = True

        return super().create(validated_data)
            
