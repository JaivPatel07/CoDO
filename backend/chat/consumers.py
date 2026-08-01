import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class ChatConsumer(WebsocketConsumer):

    def connect(self):

        self.user_name_1 = self.scope["url_route"]['kwargs']["user_name_1"]
        self.user_name_2 = self.scope["url_route"]['kwargs']["user_name_2"]

        self.group_name = self.user_name_1+self.user_name_2

        async_to_sync(self.channel_layer.group_add)(
            self.group_name,self.channel_name
        )

        # print("connected:- ",self.group_name)
        self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        # print("receive:- ",text_data)

        message = data["message"]

        async_to_sync(self.channel_layer.group_send) (
            self.group_name,
            {
                "type":"chat_message", #is name of below method
                "message":message,
                "sender":data["sender"]
            }
        )

    def chat_message(self,event):
        # print("chat message:- ",event)
        self.send(
            text_data=json.dumps({
                "message":event["message"],
                "sender":event["sender"]
            })
        )