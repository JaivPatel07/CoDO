from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Chat,ChatMessage
from django.db.models import Q
from .serializers import ChatSerializer,ChatMessageSerializer
from rest_framework.response import Response
from rest_framework import status
from accounts.models import User
from profiles.models import UserProfile
from .sendMessage import sendChatMessage

# Create your views here.
# def chatpage(request):
#     return render(request,'chat.html')

class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        chat_obj = Chat.objects.filter(Q(user1=request.user) | Q(user2=request.user))
        serializer = ChatSerializer(chat_obj,many=True)

        final_data = []
        for i in serializer.data:
            user_obj = User.objects.get(id= i['user1'] if i['user1']!=request.user.id else i['user2'])
            profile_obj = UserProfile.objects.get(user=user_obj)

            temp = i
            temp['other_username'] = user_obj.username
            temp['other_fullname'] = f"{profile_obj.firstname} {profile_obj.lastname}"
            temp['other_profile_pic'] = profile_obj.profile_pic

            final_data.append(temp)
        
        return Response(final_data,status.HTTP_200_OK)


class ChatMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, chat_id):

        chat = get_object_or_404(Chat, id=chat_id)
        messages = ChatMessage.objects.filter(chat=chat).order_by("message_at")  

        serializer = ChatMessageSerializer(messages, many=True)

        data = serializer.data

        for item, message in zip(data, messages):
            item["messanger_user"] = message.messanger_user.username

        return Response(data, status=status.HTTP_200_OK)

    # def post(self,request):
    #     chat_id = request.data['chat_id']
    #     messanger_username = request.data['messanger_username']
    #     message = request.data['message']

    #     chat_obj = Chat.objects.filter(id=chat_id).first()
    #     if chat_obj is None:
    #         user1,user2 = sorted([request.user,messanger_username],key=lambda x:x.username)
    #         chat_obj = Chat.objects.create(user1=user1,user2=user2)

    #     user_obj = get_object_or_404(User,username=messanger_username)

    #     msg = ChatMessage.objects.create(
    #         chat=chat_obj,
    #         messanger_user=user_obj,
    #         message=message
    #     )

    #     sendChatMessage(msg.id,chat_obj,user_obj.username,message,msg.message_at)

    #     return Response({"message":'success'},status.HTTP_201_CREATED)
    