from django.db import models
from django.conf import settings

# Create your models here.
class Chat(models.Model):
    user1 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_1"
    )
    user2 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_2"
    )   

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user1", "user2"],
                name="unique_private_chat"
            )
        ]


class ChatMessage(models.Model):
    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="message"
    )

    messanger_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="the_user_who_send_message"
    )

    delete_for_me = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="delete_for_this",
        null=True
    )


    message = models.TextField(max_length=500)
    message_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        models.Index(
            fields=['chat','-message_at']
        )