from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from .managers import UserManager

from django.utils import timezone
from datetime import timedelta

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150,unique=True)
    email = models.EmailField(max_length=500, unique=True)

    is_student = models.BooleanField(default=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

class PasswordResetOTP(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='password_reset_otps'
    )

    otp_hash = models.CharField(max_length=255)
    expires_at = models.DateTimeField()
    attempts = models.PositiveIntegerField(default=0)
    is_used = models.BooleanField(default=False)
    # new
    reset_token_hash = models.CharField(max_length=255, null=True, blank=True)

    # NEW
    reset_token_expiry = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"{self.user.email} - {self.created_at}"