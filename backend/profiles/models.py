from django.db import models
from django.conf import settings

class UserProfile(models.Model):

    # django will conver it to user_id
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    profile_pic = models.URLField(null=True)
    firstname = models.CharField(max_length=150)
    lastname = models.CharField(max_length=150)
    phone = models.CharField(max_length=10)
    country = models.CharField(max_length=150)
    state = models.CharField(max_length=150)
    city = models.CharField(max_length=150)
    college = models.CharField(max_length=255) 
    degree = models.CharField(max_length=255,null=True) 
    school = models.CharField(max_length=255)
    graduation_year = models.PositiveIntegerField()
    bio = models.TextField(null=True)
    experience = models.TextField()
    preferred_role = models.CharField(max_length=150)
    selectedSkills = models.JSONField(default=list)
    git_link = models.URLField()
    linkedin_link = models.URLField()

    def __str__(self):
        return f"{self.firstname} {self.lastname}"
    


class GitHubTokens(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="curr_user"
    )
    access_token = models.CharField(max_length=500)
    token_type = models.CharField(max_length=100)

