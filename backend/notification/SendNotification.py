# --> this methd is used to save notification using soket
# and also save to db
from .models import NotificationStore
from channels.layers import get_channel_layer
from profiles.models import UserProfile
from asgiref.sync import async_to_sync


# alays pass object to sender and reciver not normal data
def SendNotificationMessage(sender,reciver,notification_type,message,event_id,is_read):

    notification = NotificationStore.objects.create(
        sender=sender,
        reciver=reciver,
        notification_type=notification_type,
        message=message,
        event_id = event_id,
        is_read=is_read
    )


    channel_layer = get_channel_layer()
    print("sending notification..",reciver.username)

    profile_obj = UserProfile.objects.get(user=sender)

    sanitized_username = reciver.username.replace("@", "_at_").replace("+", "_plus_")
    async_to_sync(channel_layer.group_send)(
        f"user_{sanitized_username}",
        {
            "type": "notification_message",
            "id": notification.id,
            "senderfullname": f"{profile_obj.firstname} {profile_obj.lastname}",
            "senderusername": sender.username,
            "message": notification.message,
            "notification_type": notification.notification_type,
            "created_at": str(notification.created_at),
            "notification_post_id":notification.event_id
        }
    )


# follow these rule:
# sender,reciver :- a bav objects 
# Notification_type = message,connection,team join