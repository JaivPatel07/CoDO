import uuid
from django.conf import settings
from django.core.validators import ( MaxValueValidator,MinValueValidator,RegexValidator)
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


phone_validator = RegexValidator(
    regex=r"^\+?[0-9]{10,15}$",
    message=_("Enter a valid phone number."),
)

def max_graduation_year():
    return timezone.now().year + 10

class Profile(models.Model):
    """Profile for students and professionals."""

    class EducationLevel(models.TextChoices):
        SCHOOL = "school", _("School")
        DIPLOMA = "diploma", _("Diploma")
        UNDERGRADUATE = "undergraduate", _("Undergraduate")
        POSTGRADUATE = "postgraduate", _("Postgraduate")
        PROFESSIONAL = "professional", _("Professional / Alumni")

    class Gender(models.TextChoices):
        MALE = "male", _("Male")
        FEMALE = "female", _("Female")
        OTHER = "other", _("Other")
        PREFER_NOT_TO_SAY = "prefer_not_to_say", _("Prefer not to say")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")

    # --------------------
    # Personal Information
    # --------------------

    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    bio = models.TextField(blank=True)
    gender = models.CharField(max_length=20, choices=Gender.choices, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    is_public = models.BooleanField(default=True)

    # --------------------
    # Education
    # --------------------

    education_level = models.CharField(max_length=20, choices=EducationLevel.choices, blank=True)
    institution_name = models.CharField(max_length=255, blank=True)
    degree = models.CharField(max_length=100, blank=True)
    specialization_or_branch = models.CharField(max_length=100, blank=True)
    current_standard = models.CharField(max_length=50, blank=True)
    semester = models.PositiveSmallIntegerField(blank=True, null=True)
    graduation_year = models.PositiveIntegerField(blank=True, null=True, validators=[MinValueValidator(2000), MaxValueValidator(max_graduation_year)])
    board = models.CharField(max_length=100, blank=True)

    # --------------------
    # Professional
    # --------------------

    current_company = models.CharField(max_length=255, blank=True)
    job_title = models.CharField(max_length=150, blank=True)
    skills = models.TextField(blank=True, help_text="Comma separated skills")
    resume = models.FileField(upload_to="resumes/", blank=True, null=True)

    # --------------------
    # Social Links
    # --------------------

    portfolio_url = models.URLField(blank=True)

    github_url = models.URLField(blank=True)

    linkedin_url = models.URLField(blank=True)

    leetcode_url = models.URLField(blank=True)

    codeforces_url = models.URLField(blank=True)

    # --------------------
    # Timestamps
    # --------------------

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.full_name or self.user.email


class OrganizationProfile(models.Model):
    """Profile for organizations."""

    class OrganizationType(models.TextChoices):
        COLLEGE = "college", _("College")
        CLUB = "club", _("Club")
        COMPANY = "company", _("Company")
        COMMUNITY = "community", _("Community")
        NGO = "ngo", _("NGO")
        OTHER = "other", _("Other")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="organization_profile")
    logo = models.ImageField(upload_to="organization_logos/", blank=True, null=True)
    organization_name = models.CharField(max_length=255)
    organization_type = models.CharField(max_length=30, choices=OrganizationType.choices)
    description = models.TextField(blank=True)
    official_email = models.EmailField(blank=True)
    contact_number = models.CharField(max_length=17, validators=[phone_validator], blank=True)
    website = models.URLField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    linkedin_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.organization_name