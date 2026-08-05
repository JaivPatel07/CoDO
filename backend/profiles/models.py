from django.db import models
from django.conf import settings
from usercollabration.models import CollabrationEventPost, OpenSourceProject
from event.models import Event

class UserProfile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    profile_pic = models.URLField(null=True, blank=True)
    firstname = models.CharField(max_length=150)
    lastname = models.CharField(max_length=150)
    phone = models.CharField(max_length=10)
    country = models.CharField(max_length=150)
    state = models.CharField(max_length=150)
    city = models.CharField(max_length=150)
    college = models.CharField(max_length=255)
    degree = models.CharField(max_length=255, null=True, blank=True)
    school = models.CharField(max_length=255)
    graduation_year = models.PositiveIntegerField()
    bio = models.TextField(null=True, blank=True)
    experience = models.TextField()
    preferred_role = models.CharField(max_length=150)
    selectedSkills = models.JSONField(default=list)
    git_link = models.URLField(null=True, blank=True)
    portfolio_link = models.URLField(null=True, blank=True)
    linkedin_link = models.URLField(null=True, blank=True)

    embedding = models.JSONField(null=True,blank=True)

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
    github_username = models.CharField(null=True)


class SavedCollaborationPost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved_collab_posts")
    post = models.ForeignKey(CollabrationEventPost, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
        ordering = ['-saved_at']


class SavedEvent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved_events")
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event')
        ordering = ['-saved_at']


class SavedOpenSourceProject(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved_os_projects")
    project = models.ForeignKey(OpenSourceProject, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'project')
        ordering = ['-saved_at']
