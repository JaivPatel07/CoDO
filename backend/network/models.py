from django.db import models
from django.conf import settings


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
