import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import ChatMessage,Chat
from django.shortcuts import get_object_or_404
from accounts.models import User

class ChatConsumer(WebsocketConsumer):

    def connect(self):

        self.user_name_1 = self.scope["url_route"]['kwargs']["user_name_1"]
        self.user_name_2 = self.scope["url_route"]['kwargs']["user_name_2"]

        self.group_name = f"chat_{self.user_name_1}_{self.user_name_2}"

        async_to_sync(self.channel_layer.group_add)(
            self.group_name,self.channel_name
        )

        print("connected:- ",self.group_name)
        self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)

        sender_user = get_object_or_404(User,id=data['messanger_user'])
        chat_obj = Chat.objects.filter(id=data['chat_id']).first()

        if chat_obj is None:
            other_user = get_object_or_404(User,username=data['reciever_username'])
            user1,user2 = sorted([sender_user,other_user],key=lambda x:x.username)

            chat_obj = Chat.objects.create(user1=user1,user2=user2)

        # print("jsjdlfkjslkfjklsjdfkljsfk",self.scope)
        
        message = ChatMessage.objects.create(
            chat=chat_obj,
            messanger_user=get_object_or_404(User,id=data['messanger_user']),
            message=data["message"]
        )

        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                "type": "chat_message",
                "id": message.id,
                "message": message.message,
                "messanger_user": message.messanger_user.username,
                "message_at": message.message_at,
            }
        )
    
    
    def chat_message(self,event):
        # print("chat message:- ",event)
        self.send(
            json.dumps({
                "id":event["id"],
                "message":event["message"],
                "messanger_user":event["messanger_user"],
                "message_at":event["message_at"].isoformat()
            })
        )