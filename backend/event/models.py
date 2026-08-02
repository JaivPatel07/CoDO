from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

class Event(models.Model):
    organization = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="events"
    )
    title = models.CharField(max_length=255)
    banner_image = models.URLField(blank=True, max_length=1000)
    short_description = models.CharField(max_length=500)
    detailed_description = models.TextField()
    
    event_date = models.DateField()  # Start Date
    end_date = models.DateField(blank=True, null=True)  # End Date (optional for multi-day events)
    
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    registration_deadline = models.DateField(blank=True, null=True)  # Registration deadline
    custom_dates = models.JSONField(default=dict, blank=True)  # Optional custom dates timeline (dict of label: date)

    registration_link = models.URLField(blank=True, null=True, max_length=1000) # External registration link
    registration_link_clicks = models.PositiveIntegerField(default=0) # Click counter
    
    location = models.CharField(max_length=255)  # e.g., 'Online' or physical address
    map_link = models.URLField(blank=True, null=True, max_length=2000)  # Google Maps share/embed URL
    category = models.CharField(max_length=100)
    tags = models.CharField(max_length=255, blank=True)  # Comma-separated tags (e.g. "React, Frontend")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class EventRegistrationClick(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="registration_click_logs"
    )
    clicked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="event_registration_clicks"
    )
    clicked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["event", "-clicked_at"]),
            models.Index(fields=["clicked_at"]),
        ]


class EventView(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="view_logs"
    )
    viewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="viewed_events"
    )
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["event", "-viewed_at"]),
            models.Index(fields=["viewer", "event", "-viewed_at"]),
        ]


class EventInterest(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="interests"
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="interested_events"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["event", "student"], name="unique_event_interest")
        ]
        indexes = [
            models.Index(fields=["event", "student"]),
            models.Index(fields=["student", "-created_at"]),
        ]

    def clean(self):
        if self.student_id and not self.student.is_student:
            raise ValidationError("Only student accounts can mark interest in events.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
