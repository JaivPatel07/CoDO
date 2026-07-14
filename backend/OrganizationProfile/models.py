from django.db import models
from django.conf import settings


class OrganizationProfile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="organization_profile"
    )

    profile_pic = models.URLField(blank=True)

    industry = models.CharField(max_length=100)

    description = models.TextField(blank=True)

    contact_person = models.CharField(max_length=150, blank=True)

    phone_number = models.CharField(max_length=15, blank=True)

    website = models.URLField(blank=True)

    country = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)

    linkedin = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    twitter = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username
