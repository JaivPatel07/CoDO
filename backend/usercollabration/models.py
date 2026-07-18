from django.db import models
from django.conf import settings


class CollabrationPost(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="collaboration_posts"
    )

    title = models.CharField(max_length=255)
    description = models.TextField()

    event_type = models.CharField(max_length=100)
    event_mode = models.CharField(max_length=20)

    event_location = models.CharField(max_length=255, blank=True)
    event_url = models.URLField(blank=True)
    start_date = models.DateField()
    start_time = models.TimeField()

    end_date = models.DateField()
    end_time = models.TimeField()

    team_size = models.PositiveIntegerField()
    members_required = models.PositiveIntegerField(default=1)

    skills = models.JSONField(default=list)
    roles = models.JSONField(default=list)

    post_date = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.title