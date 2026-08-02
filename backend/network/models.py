from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


# Create your models here.
class Network(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),         # (stored in db, displayed in django admin)
        ('accepted', 'Accepted')
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_connection_requests'
    )

    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete = models.CASCADE,
        related_name='received_connection_requests'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    connect_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('sender', 'receiver')


class OrganizationFollow(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="followed_organizations"
    )
    organization = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="organization_followers"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "organization"],
                name="unique_student_organization_follow"
            ),
        ]
        indexes = [
            models.Index(fields=["student", "organization"]),
            models.Index(fields=["organization"]),
            models.Index(fields=["student"]),
        ]

    def clean(self):
        if self.student_id and not self.student.is_student:
            raise ValidationError("Only student accounts can follow organizations.")
        if self.organization_id and self.organization.is_student:
            raise ValidationError("Follow target must be an organization account.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
