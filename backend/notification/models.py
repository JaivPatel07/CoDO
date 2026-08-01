from django.db import models
from django.conf import settings

# Create your models here.
class NotificationStore(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sendername"
    )

    reciver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recivername",
       
    )

    # ==> is used to store event id fow which notification is send 
    # --> eg:- 
    # -> if userA send connection request to userB and event id is userB id
    event_id = models.IntegerField(null=True)

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    notification_type = models.CharField(max_length=50) # it will has ["join request","connection","chat"]

    message = models.TextField(null=True,blank=True)
    
    # to create index so it fast to find reciver 
    class Meta:

        indexes = [
            models.Index(
                fields=["reciver","-created_at"]
            )
        ]