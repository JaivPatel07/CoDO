import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import GroupMessage,WorkSpace
from django.shortcuts import get_object_or_404
from accounts.models import User
from teams.models import Team
from profiles.models import UserProfile

class WorkSpaceConsumer(WebsocketConsumer):

    def connect(self):

        self.workshop_id = self.scope["url_route"]['kwargs']["workshop_id"]

        self.group_name = f"workshop_{self.workshop_id}"

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

        team_obj = get_object_or_404(Team,id=data['team_id'])
        user_obj = get_object_or_404(User,username=data['messanger_user'])
        message = GroupMessage.objects.create(
            team=team_obj,
            messanger_user=user_obj,
            message=data['message']
        )
        profile_obj = UserProfile.objects.get(user=user_obj)

        
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                "type": "grp_message",
                "id": message.id,
                "message": message.message,
                "messanger_username": message.messanger_user.username,
                "messanger_fullname": f"{profile_obj.firstname} {profile_obj.lastname}",
                "message_at": message.message_at,
            }
        )
    
    def grp_message(self,event):
        # print("chat message:- ",event)
        self.send(
            json.dumps({
                "id":event["id"],
                "message":event["message"],
                "messanger_username":event["messanger_username"],
                "messanger_fullname":event["messanger_fullname"],
                "message_at":event["message_at"].isoformat()
            })
        )

