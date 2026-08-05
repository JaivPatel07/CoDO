from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated,AllowAny
from cloudStorage.Cloudinary import upload_image

from .serializers import UserProfileSerializer,FetchSerializer,UserAccountSerializer
from .models import UserProfile, GitHubTokens, SavedCollaborationPost, SavedEvent, SavedOpenSourceProject
from usercollabration.models import CollabrationEventPost, OpenSourceProject, JoinRequestLog
from event.models import Event
from teams.models import Team
from django.db.models import Count
from event.serializers import EventSerializer
from usercollabration.serializers import OpenSourceProjectSerializer
from accounts.models import User
from django.conf import settings
from MLModel.text_to_vector import profile_to_vector

import os
import requests

class CreateUserProfile(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        # print(request.data)
        # to validate if user profile already exists
        # if profile already exists then it update it
        # else create new one 
        try:
            profile = UserProfile.objects.get(user_id=request.user.id)
            is_update = True
        except UserProfile.DoesNotExist:
            profile = None
            is_update = False

        # to create url for image
        image = request.FILES.get("profile_pic")
        
        if image:
            image_url = upload_image(image)
        else:
            image_url = profile.profile_pic if is_update else ""

        # to store profile url instead of profile pic 
        data = request.data.copy()
        data['profile_pic'] = image_url

        try:
            if is_update:
                serializer = UserProfileSerializer(profile, data=data, partial=True)
            else:
                serializer = UserProfileSerializer(data=data)

            if serializer.is_valid():
                
                profile = serializer.save(user=request.user) # to send user data to save it as fk
                profile.embedding = profile_to_vector(profile)
                profile.save(update_fields=["embedding"])
                return Response({'message': 'success', 'profile': serializer.data}, status.HTTP_200_OK if is_update else status.HTTP_201_CREATED)
            
            print(serializer.errors)
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({'message': str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR)




class FetchUserData(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,user_name):
        print(request.user.id)
        data = User.objects.get(id = request.user.id)
        print(data.username)

        if data.username != user_name:
            return Response("UnAuthenticated",status.HTTP_401_UNAUTHORIZED)

        # to check weather the user is blocked or not 
        serializer = FetchSerializer(data)
        # print(serializer.data)

        if (serializer.data['is_active']):
            return Response(serializer.data,status.HTTP_200_OK)
        else:
            return Response('User Account Is Blocked',status.HTTP_401_UNAUTHORIZED)
        

class FetchUserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,user_name):
        try:
            data = UserProfile.objects.get(user_id=request.user.id)
            # print(data['email'])

            serializer = UserProfileSerializer(data)
            # print(serializer.data)

            if (serializer.data):
                return Response(serializer.data,status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({"message": "User profile not found"},status.HTTP_404_NOT_FOUND)


class UpdateUserAccount(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, user_name):
        if request.user.username != user_name:
            return Response({"detail": "UnAuthenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        if "is_active" in request.data:
            is_active_value = request.data.get("is_active")
            is_delete_request = is_active_value is False or str(is_active_value).lower() in {"false", "0", "no"}

            if is_delete_request:
                request.user.delete()
                return Response(
                    {"message": "Account deleted successfully."},
                    status=status.HTTP_200_OK,
                )

        payload = {
            "username": request.data.get("username", ""),
            "email": request.data.get("email", ""),
        }

        serializer = UserAccountSerializer(request.user, data=payload)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



import requests
class GithubLoginView(APIView):

    permission_classes = [IsAuthenticated]
    def post(self,request):

        code = request.data.get("code")

        token_url = "https://github.com/login/oauth/access_token"

        token_response = requests.post(
            token_url,
            headers={
                "Accept":"application/json"
            },
            data={
                "client_id":settings.GITHUB_CLIENT_ID,
                "client_secret":settings.GITHUB_CLIENT_SECRET,
                "code":code,
            }
        )

        token_json = token_response.json()

        # print("fjksdjfls:- ",token_json)

        access_token = token_json.get("access_token")

        github_user_response = requests.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json"
            }
        )
        github_user = github_user_response.json()
        GitHubTokens.objects.create(
            user = request.user,
            github_username = github_user["login"],
            access_token = token_json['access_token'],
            token_type = token_json['token_type']
        )
        return Response(status.HTTP_201_CREATED)


class ToggleSaveCollabPost(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        post_id = request.data.get("post_id")
        post = get_object_or_404(CollabrationEventPost, id=post_id)
        obj, created = SavedCollaborationPost.objects.get_or_create(user=request.user, post=post)
        if not created:
            obj.delete()
            return Response({"saved": False})
        return Response({"saved": True})


class ToggleSaveEvent(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        event_id = request.data.get("event_id")
        event = get_object_or_404(Event, id=event_id)
        obj, created = SavedEvent.objects.get_or_create(user=request.user, event=event)
        if not created:
            obj.delete()
            return Response({"saved": False})
        return Response({"saved": True})


class ToggleSaveProject(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        project_id = request.data.get("project_id")
        project = get_object_or_404(OpenSourceProject, id=project_id)
        obj, created = SavedOpenSourceProject.objects.get_or_create(user=request.user, project=project)
        if not created:
            obj.delete()
            return Response({"saved": False})
        return Response({"saved": True})


class FetchSavedItems(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        saved_collabs_qs = SavedCollaborationPost.objects.filter(user=request.user).select_related("post", "post__owner")
        saved_collabs = []
        for sc in saved_collabs_qs:
            p = sc.post
            try:
                profile = UserProfile.objects.get(user=p.owner)
                owner_name = f"{profile.firstname} {profile.lastname}"
                owner_pic = profile.profile_pic
            except UserProfile.DoesNotExist:
                owner_name = p.owner.username
                owner_pic = None

            team = Team.objects.filter(event=p).first()
            requestlog_exists = JoinRequestLog.objects.filter(user=request.user, event_id=p.id).exists()
            requestlog = JoinRequestLog.objects.filter(user=request.user, event_id=p.id).first() if requestlog_exists else None

            saved_collabs.append({
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "event_type": p.event_type,
                "event_mode": p.event_mode,
                "event_location": p.event_location,
                "event_url": p.event_url,
                "start_date": str(p.start_date),
                "start_time": str(p.start_time),
                "end_date": str(p.end_date),
                "end_time": str(p.end_time),
                "status": p.status,
                "post_date": str(p.post_date),
                "owner_name": owner_name,
                "owner_user_name": p.owner.username,
                "owner_pic_url": owner_pic,
                "skills": team.skills if team else [],
                "roles": team.roles if team else [],
                "members_required": team.members_required if team else None,
                "team_size": team.team_size if team else None,
                "is_saved": True,
                "is_owner": p.owner_id == request.user.id,
                "is_applied": requestlog_exists,
                "applied_status": requestlog.status if requestlog_exists else "Join",
            })

        saved_event_ids = list(
            SavedEvent.objects.filter(user=request.user).values_list("event_id", flat=True)
        )
        events_map = {
            e.id: e
            for e in Event.objects.filter(id__in=saved_event_ids)
            .select_related("organization")
            .annotate(
                profile_views=Count("view_logs", distinct=True),
                interested_count=Count("interests", distinct=True),
            )
        }
        ordered_events = [events_map[eid] for eid in saved_event_ids if eid in events_map]
        saved_events = EventSerializer(ordered_events, many=True, context={"request": request}).data

        saved_project_ids = list(
            SavedOpenSourceProject.objects.filter(user=request.user).values_list("project_id", flat=True)
        )
        projects_map = {
            p.id: p
            for p in OpenSourceProject.objects.filter(id__in=saved_project_ids).select_related("owner")
        }
        ordered_projects = [projects_map[pid] for pid in saved_project_ids if pid in projects_map]
        saved_projects = OpenSourceProjectSerializer(
            ordered_projects, many=True, context={"request": request}
        ).data

        return Response({
            "saved_collabs": saved_collabs,
            "saved_events": saved_events,
            "saved_projects": saved_projects,
        })
