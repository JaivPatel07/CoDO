from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Network
from accounts.models import User
from rest_framework.response import Response
from rest_framework import status
from .serializers import NetworkSerializer
from profiles.models import UserProfile
from django.db.models import Q
from notification.SendNotification import SendNotificationMessage
from notification.models import NotificationStore

# Create your views here.
class NetworkView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,user_name):
        user = get_object_or_404(User,username=user_name)

        followers = Network.objects.filter(
            receiver=user,
            status="accepted"
        ).order_by("-connect_at")

        following = Network.objects.filter(
            sender=user,
            status="accepted"
        ).order_by("-connect_at")

        pending = Network.objects.filter(
            Q(sender=user) | Q(receiver=user),
            status="pending"
        ).order_by("-connect_at")

        def serialize(network, other_user):
            profile = UserProfile.objects.get(user=other_user)

            return {
                "network_id": network.id,
                "sender": network.sender.id,
                "receiver": network.receiver.id,
                "status": network.status,
                "connect_at": network.connect_at,
                "user_id": other_user.id,
                "username": other_user.username,
                "fullname": f"{profile.firstname} {profile.lastname}",
                "profile_pic": profile.profile_pic if profile.profile_pic else None,
                "is_receiver": network.receiver == user,
            }

        data = {
            "followers": [],
            "following": [],
            "pending": []
        }

        for network in followers:
            data["followers"].append(
                serialize(network, network.sender)
            )

        for network in following:
            data["following"].append(
                serialize(network, network.receiver)
            )

        for network in pending:
            other_user = (
                network.sender
                if network.sender != user
                else network.receiver
            )

            data["pending"].append(
                serialize(network, other_user)
            )

        return Response(data, status=status.HTTP_200_OK)

    
    def post(self,request):

        sender_user = request.user


        reciver_user_obj = get_object_or_404(User,username=request.data['receiver_username'])
        network_obj = Network.objects.create(
            sender = request.user,
            receiver = reciver_user_obj,
            status = "pending"
        )

        SendNotificationMessage(request.user,reciver_user_obj,"connection","want to connect with you",network_obj.id,False)
        
        return Response(status.HTTP_201_CREATED)

    def put(self,request):

        # print(request)
        is_accept = request.data["is_accept"]
        user_obj = get_object_or_404(User,username=request.data['user_name'])
        # print("sssdf:- ",user_obj)
        network_obj = get_object_or_404(Network,sender=user_obj,receiver=request.user)


        if "network_id" in request.data:
            no = get_object_or_404(NotificationStore,event_id=request.data['network_id'])
            no.delete()
        
        if not is_accept:
            network_obj.delete()
            return Response({"message":'request rejected'},status.HTTP_200_OK)

        network_obj.status = "accepted"
        network_obj.save()
        
        return Response({"message":"request accepted"},status.HTTP_202_ACCEPTED)

    def delete(self,request,user_id):
        user_obj = get_object_or_404(User,id=user_id)
        network_obj = get_object_or_404(Network,Q(sender=user_obj) | Q(receiver=user_obj))

        network_obj.delete()
        return Response({"message":"network delete"},status.HTTP_200_OK)


