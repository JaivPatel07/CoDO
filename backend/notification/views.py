from rest_framework.views import APIView
from accounts.models import User
from rest_framework.permissions import IsAuthenticated
from .models import NotificationStore
from rest_framework.response import Response
from rest_framework import status
from profiles.models import UserProfile
from OrganizationProfile.models import OrganizationProfile
from .SendNotification import SendNotificationMessage

# Create your views here.
class NotificationView(APIView):
    permission_classes = [IsAuthenticated]

    # --> if userA send to userB but it was offline then when userB again online to fecth notification for him
    # --> also to send previous notification 
    def get(self, request):
        messages = NotificationStore.objects.filter(reciver=request.user).select_related("sender").order_by("-created_at")
        serializer = NotificationSerializer(messages, many=True)

        final_data = []
        for i in serializer.data:

            # to make join relation use user__tthat table col name
            sender = User.objects.get(username=i['sender'])
            temp = i
            if sender.is_student:
                profile_obj = UserProfile.objects.filter(user=sender).first()
                temp["senderfullname"] = (
                    f"{profile_obj.firstname} {profile_obj.lastname}".strip()
                    if profile_obj
                    else sender.username
                )
                temp["user_pic_url"] = profile_obj.profile_pic if profile_obj else None
                temp["sender_profile_url"] = f"/user/{sender.username}/profile"
            else:
                org_profile = OrganizationProfile.objects.filter(user=sender).first()
                temp["senderfullname"] = sender.username
                temp["user_pic_url"] = org_profile.profile_pic if org_profile else None
                temp["sender_profile_url"] = f"/organization/{sender.username}/profile"
            temp["senderusername"] = i['sender']
            final_data.append(temp)
        return Response(final_data, status=status.HTTP_200_OK)

    # to store notification in ddb 
    def post(self, request):
        # print(request.data)
        sender = request.user
        reciver = User.objects.get(username=request.data['reciver_name'])
        # print(reciver.username)

        SendNotificationMessage(sender, reciver, "team join", "want to join your team", request.data['event_id'], False)

        return Response({"message": "success"})

class MarkAllNotificationsRead(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        NotificationStore.objects.filter(
            reciver=request.user,
            is_read=False
        ).update(is_read=True)

        return Response({"message": "Success"}, status=status.HTTP_200_OK)
