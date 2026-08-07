from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Chat, ChatMessage
from django.db.models import Q
from .serializers import ChatSerializer, ChatMessageSerializer
from rest_framework.response import Response
from rest_framework import status
from accounts.models import User
from profiles.models import UserProfile
from .sendMessage import sendChatMessage


class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chat_obj = Chat.objects.filter(Q(user1=request.user) | Q(user2=request.user))
        serializer = ChatSerializer(chat_obj, many=True)

        final_data = []
        for i in serializer.data:
            # --> other user in the chat
            other_user_id = i['user1'] if i['user1'] != request.user.id else i['user2']
            user_obj = User.objects.get(id=other_user_id)
            profile_obj = UserProfile.objects.get(user=user_obj)

            temp = i
            temp['other_username'] = user_obj.username
            temp['other_fullname'] = f"{profile_obj.firstname} {profile_obj.lastname}"
            temp['other_profile_pic'] = profile_obj.profile_pic

            # --> unread messages from the other user to the current user
            chat_obj_ref = Chat.objects.get(id=i['id'])
            unread_count = ChatMessage.objects.filter(
                chat=chat_obj_ref,
                messanger_user=user_obj,
                is_read=False,
            ).exclude(delete_for_me=request.user).count()
            temp['unread_count'] = unread_count

            final_data.append(temp)

        return Response(final_data, status.HTTP_200_OK)


class ChatMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, chat_id):
        chat = get_object_or_404(Chat, id=chat_id)
        messages = ChatMessage.objects.filter(chat=chat).exclude(delete_for_me=request.user).order_by("message_at")

        serializer = ChatMessageSerializer(messages, many=True)
        data = serializer.data

        for item, message in zip(data, messages):
            item["messanger_user"] = message.messanger_user.username

        return Response(data, status=status.HTTP_200_OK)

    def delete(self, request, msg_id):
        d_type = request.data.get("delete_type")
        message_obj = get_object_or_404(ChatMessage, id=msg_id)

        if d_type == "me":
            message_obj.delete_for_me = request.user
            message_obj.save()

        if d_type == "everyone":
            if message_obj.messanger_user == request.user:
                message_obj.delete()
            else:
                # Proper Error Message
                return Response(
                    {"message": "Unauthorized: You can only delete your own messages for everyone."}, 
                    status.HTTP_401_UNAUTHORIZED
                )

        # Proper Success Message
        return Response(
            {'message': 'Message deleted successfully.'}, 
            status.HTTP_200_OK
        )


class MarkChatReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, chat_id):
        chat = get_object_or_404(Chat, id=chat_id)

        # --> ensure the requesting user is part of this chat
        if request.user not in [chat.user1, chat.user2]:
            return Response(
                {"message": "Unauthorized: You are not part of this chat."},
                status.HTTP_403_FORBIDDEN,
            )

        # --> mark all messages from the OTHER user as read
        ChatMessage.objects.filter(
            chat=chat,
            messanger_user=(chat.user2 if chat.user1 == request.user else chat.user1),
            is_read=False,
        ).update(is_read=True)

        return Response({"message": "Chat marked as read."}, status.HTTP_200_OK)
