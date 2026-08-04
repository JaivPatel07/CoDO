from django.db import models
from django.conf import settings
from teams.models import Team

# Create your models here.
class WorkSpace(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="workspace_user"
    )

    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name="workspace_team"
    )

# to store message from grp 
class GroupMessage(models.Model):
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    messanger_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    delete_for_me = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="delete_for_me",
        null=True
    )

    message = models.TextField()
    message_at = models.DateTimeField(auto_now_add=True)

class WorkSpaceRepository(models.Model):
    workspace = models.ForeignKey(
        WorkSpace,
        on_delete=models.CASCADE
    )
    github_repo_id = models.BigIntegerField()
    repo_name = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    owner = models.CharField(max_length=255)
    private = models.BooleanField(default=False)
    default_branch = models.CharField(max_length=100)
    html_url = models.URLField()
    connected_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )    