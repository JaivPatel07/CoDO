
from django.db import models
from django.conf import settings
from usercollabration.models import CollabrationEventPost

# Create your models here.
class Team(models.Model):
    leader = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    event = models.ForeignKey(
        CollabrationEventPost,
        on_delete=models.CASCADE,
        null=True
    )

    team_name = models.CharField(max_length=150,null=True)


    team_size = models.PositiveIntegerField(null=True)
    members_required = models.PositiveIntegerField(default=1,null=True)

    skills = models.JSONField(default=list,null=True,blank=True)
    roles = models.JSONField(default=list,null=True,blank=True)


class TeamMembers(models.Model):

    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE
    )

    member = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    joined_at = models.DateTimeField(auto_now_add=True,null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["team", "member"],
                name="unique_team_member"
            )
        ]

class TeamInvite(models.Model):
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE
    ) 
    invite_link = models.CharField(max_length=20,unique=True)
    # member_accept = models.DecimalField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)