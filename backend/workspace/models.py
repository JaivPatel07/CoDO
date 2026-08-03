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