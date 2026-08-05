from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from event.models import Event
from usercollabration.models import CollabrationEventPost, OpenSourceProject


class SavedItem(models.Model):
    EVENT = "event"
    PROJECT = "project"
    COLLABRATION = "collabration"

    ITEM_TYPES = [
        (EVENT, "Event"),
        (PROJECT, "Open source project"),
        (COLLABRATION, "Collabration post"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_items"
    )
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES)

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="saved_by"
    )
    project = models.ForeignKey(
        OpenSourceProject,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="saved_by"
    )
    collabration = models.ForeignKey(
        CollabrationEventPost,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="saved_by"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["user", "event"], name="unique_saved_event"),
            models.UniqueConstraint(fields=["user", "project"], name="unique_saved_project"),
            models.UniqueConstraint(fields=["user", "collabration"], name="unique_saved_collabration"),
        ]
        indexes = [
            models.Index(fields=["user", "item_type", "-created_at"]),
        ]

    def clean(self):
        targets = [self.event_id, self.project_id, self.collabration_id]
        if len([target for target in targets if target is not None]) != 1:
            raise ValidationError("A saved item must reference exactly one object.")

    def __str__(self):
        return f"{self.user.username} saved {self.item_type}"
