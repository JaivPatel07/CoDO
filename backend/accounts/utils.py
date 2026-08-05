import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail
from django.utils import timezone


def generate_otp():
    return str(secrets.randbelow(900000) + 100000)

def hash_otp(otp):
    return make_password(otp)

def verify_otp(plain_otp, hashed_otp):
    return check_password(plain_otp, hashed_otp)

def generate_reset_token():
    return secrets.token_urlsafe(32)

def hash_reset_token(token):
    return make_password(token)

def verify_reset_token(token, hashed_token):
    return check_password(token, hashed_token)

def otp_expiry():
    return timezone.now() + timedelta(minutes=10)

def reset_token_expiry():
    return timezone.now() + timedelta(minutes=10)

def send_otp_email(email, otp):
    send_mail(
        subject="CoDO Password Reset OTP",
        message=f"""
Your OTP for resetting your password is:

{otp}

This OTP is valid for 10 minutes.

If you didn't request this, ignore this email.

-CoDO Team
""",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )