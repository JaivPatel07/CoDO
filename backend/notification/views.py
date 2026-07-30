from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from accounts.models import User
from rest_framework.permissions import IsAuthenticated
from .models import NotificationStore
from .serializers import NotificationSerializer
from rest_framework.response import Response
from rest_framework import status
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from usercollabration.models import JoinRequestLog
from profiles.models import UserProfile
from .SendNotification import SendNotificationMessage

# Create your views here.
class NotificationView(APIView):
    permission_classes = [IsAuthenticated]


    # --> if userA send to userB but it was offline then when userB again online to fecth notification for him
    # --> also to send previous notification 
    def get(self, request):
        messages = NotificationStore.objects.filter(reciver=request.user)
        serializer = NotificationSerializer(messages, many=True)

        final_data = []
        for i in serializer.data:

            # to make join relation use user__tthat table col name
            
            profile_obj = UserProfile.objects.get(user__username=i['sender'])
            temp = i
            temp["senderfullname"] = f"{profile_obj.firstname} {profile_obj.lastname}"
            final_data.append(temp)
        return Response(final_data, status=status.HTTP_200_OK)

    # to store notification in ddb 
    def post(self,request):
        # print(request.data)
        sender = request.user
        reciver = User.objects.get(username=request.data['reciver_name'])
        # print(reciver.username)
        
        SendNotificationMessage(sender,reciver,"team join","want to join your team",request.data['event_id'],False)

        return Response({"message": "success"})