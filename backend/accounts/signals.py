from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User
from profiles.models import Profile, OrganizationProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Automatically create a profile when a new user is created.
    """

    if not created:
        return

    if instance.account_type == User.AccountType.ORGANIZATION:
        OrganizationProfile.objects.get_or_create(user=instance)
    else:
        Profile.objects.get_or_create(user=instance)