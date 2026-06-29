from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


class User(AbstractUser):
    """
    Custom User model using email as the primary login field.
    """

    class AccountType(models.TextChoices):
        STUDENT = "student", _("Student / Professional")
        ORGANIZATION = "organization", _("Organization")

    username = models.CharField(_("username"), max_length=150, unique=True)
    email = models.EmailField(_("email address"), unique=True)
    first_name = models.CharField(_("first name"), max_length=150)
    last_name = models.CharField(_("last name"), max_length=150)

    phone_validator = RegexValidator(regex=r"^\+?[0-9]{10,15}$", message=_("Enter a valid phone number."))
    phone_number = models.CharField(_("phone number"), max_length=17, validators=[phone_validator], blank=True)
    account_type = models.CharField(_("account type"), max_length=20, choices=AccountType.choices)
    is_profile_completed = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()