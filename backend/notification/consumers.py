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

        # --> also join the chat-unread group so unread chat signals reach this client
        self.chat_unread_group = f"chat_unread_{self.group_name}"
        async_to_sync(self.channel_layer.group_add)(
            self.chat_unread_group,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )
        async_to_sync(self.channel_layer.group_discard)(
            self.chat_unread_group,
            self.channel_name
        )

    def chat_unread_message(self, event):
        # --> forward unread chat signal to the client
        self.send(
            text_data=json.dumps({
                "type": "chat_unread",
                "sender_username": event["sender_username"],
                "chat_id": event["chat_id"],
            })
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
