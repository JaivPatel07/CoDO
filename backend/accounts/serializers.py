from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User
import re



class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    confirmPassword = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
            "confirmPassword",
            "is_student",
        )


    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value


    def validate_password(self, value):

        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long."
            )

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter."
            )

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter."
            )

        if not re.search(r"\d", value):
            raise serializers.ValidationError(
                "Password must contain at least one number."
            )

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-+=/\\[\]]", value):
            raise serializers.ValidationError(
                "Password must contain at least one special character."
            )

        return value

    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            is_student=validated_data.get("is_student", True),
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )
    account_type = serializers.CharField(write_only=True)


    def validate_password(self, value):

        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long."
            )

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter."
            )

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter."
            )

        if not re.search(r"\d", value):
            raise serializers.ValidationError(
                "Password must contain at least one number."
            )

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-+=/\\[\]]", value):
            raise serializers.ValidationError(
                "Password must contain at least one special character."
            )

        return value


    def validate(self, attrs):
        user = authenticate(  #to convert password to hash {normal object.filter can't convert}
            email=attrs["email"],
            password=attrs["password"],
        )

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        account_type = attrs.get("account_type")

        if account_type == "student" and not user.is_student:
            raise serializers.ValidationError("This is an organization account. Please log in as an organization.")

        if account_type == "organization" and user.is_student:
            raise serializers.ValidationError("This is a student account. Please log in as a student.")

        attrs["user"] = user
        return attrs