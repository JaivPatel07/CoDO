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

    embedding = models.JSONField(null=True,blank=True)

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


class OpenSourceProject(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="opensource_projects"
    )
    github_repo_id = models.CharField(max_length=255, blank=True)
    repository_name = models.CharField(max_length=255)
    repository_url = models.URLField()
    tagline = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100, blank=True)
    difficulty = models.CharField(max_length=50)
    
    # JSON arrays for arrays of strings
    technologies = models.JSONField(default=list, blank=True)
    roles_needed = models.JSONField(default=list, blank=True)
    skills_required = models.JSONField(default=list, blank=True)
    
    # Optional Media
    
    # GitHub synced stats
    forks = models.IntegerField(default=0)
    open_issues = models.IntegerField(default=0)
    contributors_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    status = models.CharField(max_length=50, default="Looking for Contributors")
    
    def __str__(self):
        return f"{self.repository_name} by {self.owner.username}"
