from django.db import models
from django.conf import settings


class OrganizationProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="organization_profile"
    )

    organization_type = models.CharField(max_length=100)

    logo = models.URLField(blank=True)

    description = models.TextField()

    contact_person = models.CharField(max_length=150)

    phone_number = models.CharField(max_length=15)

    website = models.URLField(blank=True)

    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    linkedin = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    twitter = models.URLField(blank=True)


    def __str__(self):
        return self.user.username