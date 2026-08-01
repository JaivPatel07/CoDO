from django.db import models
from django.conf import settings


class CollabrationEventPost(models.Model):
    owner = models.ForeignKey(
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

    post_date = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=True) #true-open false-close

    def __str__(self):
        return self.title


class JoinRequestLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="join_request_log"
    )
    event = models.ForeignKey(
        CollabrationEventPost,
        on_delete=models.CASCADE
    )
    status = models.CharField()

    created_at = models.DateTimeField(auto_now_add=True)

