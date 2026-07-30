from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Network
from accounts.models import User
from rest_framework.response import Response
from rest_framework import status
from .serializers import NetworkSerializer
from profiles.models import UserProfile

# Create your views here.
class NetworkView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):

        network_obj = Network.objects.filter(receiver=request.user).order_by("-connect_at")

        serializer = NetworkSerializer(network_obj,many=True)
        final_data = []

        for i in serializer.data:
            user_obj = User.objects.get(id=i['sender'])
            profile_obj = UserProfile.objects.get(user=user_obj)
            temp = i
            temp["user_name"] = user_obj.username
            temp["user_profile_pic"] = profile_obj.profile_pic
            temp["fullname"] = f"{profile_obj.firstname} {profile_obj.lastname}"
            temp["user_id"] = user_obj.id

        return Response(serializer.data,status.HTTP_200_OK)


    def post(self,request):

        sender_user = request.data["sender_user"]

        sender_user_obj = get_object_or_404(User,username=sender_user)

        Network.objects.create(
            sender = sender_user_obj,
            receiver = request.user,
            status = "pending"
        )

        return Response(status.HTTP_201_CREATED)

    def put(self,request):

        sender_user = request.data["sender_user"]
        is_accept = request.data["is_accept"]
        sender_user_obj = get_object_or_404(User,username=sender_user)

        network_obj = get_object_or_404(Network,sender = sender_user_obj,receiver = request.user)

        if not is_accept:
            network_obj.delete()
            return Response({"message":'request rejected'},status.HTTP_200_OK)

        network_obj.status = "accepted"
        network_obj.save()
        return Response({"message":"request accepted"},status.HTTP_202_ACCEPTED)

    def delete(self,request,user_id):
        sender_user_obj = get_object_or_404(User,id=user_id)
        network_obj = get_object_or_404(Network,sender = sender_user_obj,receiver = request.user)

        network_obj.delete()
        return Response({"message":"network delete"},status.HTTP_200_OK)


