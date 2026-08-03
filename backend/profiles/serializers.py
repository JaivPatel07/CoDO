from rest_framework import serializers
from .models import UserProfile
import re
from accounts.models import User


class UserAccountSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=150, min_length=3, trim_whitespace=True)
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ["username", "email"]

    def validate_username(self, value):
        queryset = User.objects.filter(username=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        queryset = User.objects.filter(email=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def update(self, instance, validated_data):
        instance.username = validated_data["username"]
        instance.email = validated_data["email"]
        instance.save(update_fields=["username", "email"])
        return instance

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

    # Validate linkedin link
    def validate_linkedin_link(self, value):
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("URL must start with http:// or https://")
        return value

    
    def create(self, validated_data):
        # print("validated_data:", validated_data)
        return UserProfile.objects.create(**validated_data)
    

class FetchSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['email','username','is_active','is_student']