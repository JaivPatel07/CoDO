import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class NotificationConsumer(WebsocketConsumer):

    def connect(self):
        raw_name = self.scope["url_route"]["kwargs"]["room_name"]
        # Sanitize: channel layer group names only allow alphanumerics, hyphens, underscores, periods
        self.group_name = raw_name.replace("@", "_at_").replace("+", "_plus_")

        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def notification_message(self, event):
        # print("event:-------",event)
        self.send(
            text_data=json.dumps({
                "id": event["id"],
                "senderusername": event["senderusername"],
                "senderfullname": event["senderfullname"],
                "message": event["message"],
                "notification_type": event["notification_type"],
                "created_at": event["created_at"],
                "event_id":event["notification_post_id"],
                "is_read":False
            })
        )