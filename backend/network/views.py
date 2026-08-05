from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Network, OrganizationFollow
from accounts.models import User
from rest_framework.response import Response
from rest_framework import status
from .serializers import NetworkSerializer
from profiles.models import UserProfile
from django.db.models import Q
from notification.SendNotification import SendNotificationMessage
from notification.models import NotificationStore
from MLModel.cosine_recommendation import get_recommendations

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

        is_accept = request.data.get("is_accept")
        user_name = request.data.get("user_name")
        network_id = request.data.get("network_id")

        user_obj = get_object_or_404(User, username=user_name)
        network_obj = get_object_or_404(Network, sender=user_obj, receiver=request.user)

        # Safely update the notification if it exists — don't 404 if not found
        if network_id is not None:
            NotificationStore.objects.filter(event_id=network_id).update(is_read=True)

        if not is_accept:
            network_obj.delete()
            return Response({"message": 'request rejected'}, status.HTTP_200_OK)

        network_obj.status = "accepted"
        network_obj.save()
        
        return Response({"message": "request accepted"}, status.HTTP_202_ACCEPTED)

    def delete(self,request,user_id):
        user_obj = get_object_or_404(User,id=user_id)
        network_obj = get_object_or_404(Network,Q(sender=user_obj) | Q(receiver=user_obj))

        network_obj.delete()
        return Response({"message":"network delete"},status.HTTP_200_OK)


class ConnectionSuggestions(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        limit = request.query_params.get('limit')
        if not limit:
            limit = 3

        current_user = request.user

        # users who already have any connection(accepted/pending) with current user
        connected_user_ids = set()

        connections = Network.objects.filter(Q(sender=current_user) | Q(receiver=current_user))

        for connection in connections:
            if connection.sender == current_user:
                connected_user_ids.add(connection.receiver.id)
            else:
                connected_user_ids.add(connection.sender.id)

        # exclude current user and connected/pending users
        suggested_users = UserProfile.objects.exclude(user_id__in=connected_user_ids).exclude(user=current_user)

        # try:
        #     suggested_users = suggested_users[:int(limit)]
        # except ValueError:
        #     pass
        # print("hjghgjkhjk:-",suggested_users)

        current_user_profie = UserProfile.objects.get(user=request.user)
        recommended_users = get_recommendations(current_user_profie,suggested_users,"embedding",int(limit))
        # print(recommended_users)
        data = []

        for x in recommended_users:
            profile = x['object']
            user = User.objects.get(id=profile.user_id)
            data.append({
                'id' : user.id,
                'username' : user.username,
                'fullname' : f'{profile.firstname} {profile.lastname}'.strip(),
                'profile_pic' : profile.profile_pic,
                'bio' : profile.bio,
                'college' : profile.college,
                'preferred_role' : profile.preferred_role,
                'skills' : profile.selectedSkills,
                'connections' : Network.objects.filter(
                    Q(sender=user) | Q(receiver=user), status='accepted'
                ).count(),
            })

        return Response(data, status=status.HTTP_200_OK)


class OrganizationFollowView(APIView):
    permission_classes = [IsAuthenticated]

    def get_organization(self, organization_id):
        return get_object_or_404(User, id=organization_id, is_student=False, is_active=True)

    def post(self, request, organization_id):
        if not request.user.is_student:
            return Response(
                {"error": "Organization accounts cannot follow profiles."},
                status=status.HTTP_403_FORBIDDEN
            )

        organization = self.get_organization(organization_id)

        follow, created = OrganizationFollow.objects.get_or_create(
            student=request.user,
            organization=organization
        )

        if not created:
            return Response(
                {"error": "You are already following this organization."},
                status=status.HTTP_400_BAD_REQUEST
            )

        follower_count = OrganizationFollow.objects.filter(organization=organization).count()
        return Response(
            {
                "message": "Organization followed.",
                "is_following": True,
                "followers_count": follower_count,
            },
            status=status.HTTP_201_CREATED
        )

    def delete(self, request, organization_id):
        if not request.user.is_student:
            return Response(
                {"error": "Organization accounts cannot unfollow profiles."},
                status=status.HTTP_403_FORBIDDEN
            )

        organization = self.get_organization(organization_id)
        deleted_count, _ = OrganizationFollow.objects.filter(
            student=request.user,
            organization=organization
        ).delete()

        follower_count = OrganizationFollow.objects.filter(organization=organization).count()
        return Response(
            {
                "message": "Organization unfollowed." if deleted_count else "You were not following this organization.",
                "is_following": False,
                "followers_count": follower_count,
            },
            status=status.HTTP_200_OK
        )


class OrganizationFollowersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, organization_id):
        if request.user.is_student or request.user.id != organization_id:
            return Response(
                {"error": "Only this organization can view its followers."},
                status=status.HTTP_403_FORBIDDEN
            )

        follows = (
            OrganizationFollow.objects
            .filter(organization_id=organization_id)
            .select_related("student")
            .order_by("-created_at")
        )

        data = []
        for follow in follows:
            profile = UserProfile.objects.filter(user=follow.student).first()
            data.append({
                "id": follow.student.id,
                "username": follow.student.username,
                "email": follow.student.email,
                "fullname": f"{profile.firstname} {profile.lastname}".strip() if profile else follow.student.username,
                "profile_pic": profile.profile_pic if profile else None,
                "followed_at": follow.created_at,
            })

        return Response(data, status=status.HTTP_200_OK)


class FollowingOrganizationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_student:
            return Response(
                {"error": "Only students can follow organizations."},
                status=status.HTTP_403_FORBIDDEN
            )

        follows = (
            OrganizationFollow.objects
            .filter(student=request.user, organization__is_active=True)
            .select_related("organization", "organization__organization_profile")
            .order_by("-created_at")
        )

        data = []
        for follow in follows:
            organization = follow.organization
            profile = getattr(organization, "organization_profile", None)
            data.append({
                "id": organization.id,
                "username": organization.username,
                "profile_pic": profile.profile_pic if profile else "",
                "industry": profile.industry if profile else "",
                "description": profile.description if profile else "",
                "followed_at": follow.created_at,
            })

        return Response(data, status=status.HTTP_200_OK)
