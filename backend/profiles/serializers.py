from rest_framework import serializers
from .models import UserProfile
import re
from accounts.models import User
class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserProfile
        fields = "__all__"
        read_only_fields = ["user"]

    # Validate phone number
    def validate_phone(self, value):
        value = value.strip()

        if not re.fullmatch(r"\d{10}", value):
            raise serializers.ValidationError(
                "Phone number must contain exactly 10 digits."
            )

        return value

    # Validate first name
    def validate_firstname(self, value):
        if not value.strip():
            raise serializers.ValidationError("First name cannot be empty.")
        return value

    # Validate last name
    def validate_lastname(self, value):
        if not value.strip():
            raise serializers.ValidationError("Last name cannot be empty.")
        return value

    # Validate country
    def validate_country(self, value):
        if not value.strip():
            raise serializers.ValidationError("Country cannot be empty.")
        return value

    # Validate state
    def validate_state(self, value):
        if not value.strip():
            raise serializers.ValidationError("State cannot be empty.")
        return value
    # Validate state
    def validate_degree(self, value):
        if not value:
            raise serializers.ValidationError("This filed may noy be empty.")
        return value

    # Validate city
    def validate_city(self, value):
        if not value.strip():
            raise serializers.ValidationError("City cannot be empty.")
        return value
    
    # Validate skills
    def validate_selectedSkills(self, value):
        if not value:
            raise serializers.ValidationError("This filed may not be empty.")
        return value

    # Validate college
    def validate_college(self, value):
        if not value.strip():
            raise serializers.ValidationError("College cannot be empty.")
        return value

    # Validate school
    def validate_school(self, value):
        if not value.strip():
            raise serializers.ValidationError("School cannot be empty.")
        return value

    # Validate preferred role
    def validate_preferred_role(self, value):
        if not value.strip():
            raise serializers.ValidationError("Preferred role cannot be empty.")
        return value

    
    def create(self, validated_data):
        print("validated_data:", validated_data)
        return UserProfile.objects.create(**validated_data)
    

class FetchSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['email','username','is_active']