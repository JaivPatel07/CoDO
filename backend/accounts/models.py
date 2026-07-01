from django.db import models
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):

    class AccountType(models.TextChoices):
        STUDENT = "student", ("Student / Professional")
        ORGANIZATION = "organization", ("Organization")

    username = models.CharField(("username"), max_length=150, unique=True)
    email = models.EmailField(("email address"), unique=True)
    first_name = models.CharField(("first name"), max_length=150)
    last_name = models.CharField(("last name"), max_length=150)

    phone_validator = RegexValidator(regex=r"^\+?[0-9]{10,15}$", message=("Enter a valid phone number."))
    phone_number = models.CharField(("phone number"), max_length=17, validators=[phone_validator], blank=True)
    account_type = models.CharField(("account type"), max_length=20, choices=AccountType.choices)
    is_profile_completed = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email