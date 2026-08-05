from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from accounts.models import User
from profiles.models import UserProfile
from rest_framework.response import Response
from rest_framework import status
from .serializers import FetchPostSerializer,AddPostSerializer,JoinRequestLogSerializer
from teams.serializers import TeamSerializer,TeamMemberSerializer
from .models import CollabrationEventPost,JoinRequestLog
from teams.models import Team,TeamMembers
from notification.models import NotificationStore
from saved.models import SavedItem
from MLModel import cosine_recommendation,text_to_vector
# Create your views here.

# change all 
# it manage al the funtionality of sending and gettiong post data and prediction
class CollabrationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        filter_type = request.GET.get("filter_type")
        sort = request.GET.get("sort")
        postId = request.GET.get("postId")

        final_data = []

        # Fetch single post
        if postId:
            try:
                post = CollabrationEventPost.objects.get(id=postId)

                team_obj = get_object_or_404(Team,event=post)
                print(team_obj,post)
                is_team_member = TeamMembers.objects.filter(team=team_obj,member_id=request.user.id).exists()
                # print("dfsfsjfkldfsfslkfs",is_team_member)
                if post.owner_id != request.user.id and not is_team_member:
                    return Response(
                        {"message": "Unauthorized"},
                        status=status.HTTP_401_UNAUTHORIZED
                    )

                posts = [post]

            except CollabrationEventPost.DoesNotExist:
                return Response(
                    {"message": "Invalid PostId"},
                    status=status.HTTP_404_NOT_FOUND
                )

        else:
            posts = CollabrationEventPost.objects.all()

            if filter_type == "Hackathon":
                posts = posts.filter(event_type="Hackathon")

            elif filter_type == "Side Project":
                posts = posts.filter(event_type="Side Project")

            elif filter_type == "Open Source":
                posts = posts.filter(event_type="Open Source")

            elif filter_type == "My Post":
                posts = posts.filter(owner=request.user)

            elif filter_type == "Best for me":
                posts = posts.filter(owner=request.user)

            if sort == "Latest":
                posts = posts.order_by("-post_date")

            if not posts.exists():
                return Response(
                    {"message": "No Collaboration Added Yet!"},
                    status=status.HTTP_204_NO_CONTENT
                )

        serializer = FetchPostSerializer(posts, many=True)

        for post in serializer.data:
            temp = dict(post)

            user = User.objects.get(id=post["owner"])
            profile = UserProfile.objects.get(user_id=post["owner"])
            
            requestlogexits = JoinRequestLog.objects.filter(
                user=request.user,
                event_id=post["id"]
            ).exists()

            if requestlogexits:
                requestlog = JoinRequestLog.objects.get(
                    user=request.user,
                    event_id=post["id"]
                )
            
            team = Team.objects.filter(event_id=post["id"]).first()

            temp["owner_name"] = f"{profile.firstname} {profile.lastname}"
            temp["owner_user_name"] = user.username
            temp["is_owner"] = post["owner"] == request.user.id
            temp["applied_status"] = requestlog.status if requestlogexits else "Join"
            temp["is_applied"] = requestlogexits
            temp["is_saved"] = SavedItem.objects.filter(
                user=request.user,
                collabration_id=post["id"]
            ).exists()

            if team:
                temp["team_id"] = team.id
                temp["team_size"] = team.team_size
                temp["members_required"] = team.members_required
                temp["skills"] = team.skills
                temp["roles"] = team.roles
            else:
                temp["team_id"] = None
                temp["team_size"] = None
                temp["members_required"] = None
                temp["skills"] = []
                temp["roles"] = []

            final_data.append(temp)

        if postId:
            return Response(final_data[0], status=status.HTTP_200_OK)

        return Response(final_data, status=status.HTTP_200_OK)
    


    def post(self,request):

        post_data = {
            "title": request.data["title"],
            "description" : request.data["description"]
        }

        serializer_post = AddPostSerializer(data={
            "title": request.data["title"],
            "description": request.data["description"],
            "event_type": request.data["event_type"],
            "event_mode": request.data["event_mode"],
            "event_location": request.data["event_location"],
            "event_url": request.data["event_url"],
            "start_date": request.data["start_date"],
            "start_time": request.data["start_time"],
            "end_date": request.data["end_date"],
            "end_time": request.data["end_time"],
        })

        serializer_team = TeamSerializer(data={
            "team_size":request.data["team_size"],
            "members_required":request.data["members_required"],
            "skills":request.data["skills"],
            "roles":request.data["roles"]
        })


        if serializer_post.is_valid():
            if serializer_team.is_valid():
                latest_event = serializer_post.save(owner=request.user)
                serializer_team.save(leader=request.user,event=latest_event)
                return Response("created",status.HTTP_201_CREATED)
            else:
                print(serializer_team.errors)
                return Response(serializer_team.errors,status.HTTP_404_NOT_FOUND)

        else:
            print(serializer_post.errors)
            return Response(serializer_post.errors,status.HTTP_404_NOT_FOUND)


    def delete(self,request,event_id):
        event_obj = get_object_or_404(CollabrationEventPost,id=event_id)

        if event_obj.owner != request.user:
            return Response({"message":"UnAuthorized"},status.HTTP_401_UNAUTHORIZED)

        event_obj.delete()
        return Response(status.HTTP_200_OK)


# to add data in post request log that store all log of user who apply for it 
class JoinRequestLogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,event_id):
        team = get_object_or_404(Team,event_id=event_id)
        if request.user != team.leader:
            return Response({"message": "Unauthorized"},status=status.HTTP_401_UNAUTHORIZED)

        
        request_log = JoinRequestLog.objects.filter(event_id=event_id)
        serializer = JoinRequestLogSerializer(request_log,many=True)

        final_data = []
        for i in serializer.data:
            user_obj = User.objects.get(id=i['user'])
            profile_obj = UserProfile.objects.get(user=user_obj)
            temp = i
            
            temp["request_user_name"] = user_obj.username,
            temp["request_fullname"] = f"{profile_obj.firstname} {profile_obj.lastname}",
            temp["request_user_pic"] = profile_obj.profile_pic
            final_data.append(temp)
        return Response(final_data,status.HTTP_200_OK)
        
    def post(self,request):
        post_data = get_object_or_404(CollabrationEventPost,id=request.data['post_id'])
        print(post_data)
        JoinRequestLog.objects.create(
            user = request.user,
            event = post_data,
            status = "requested"
        )

        return Response({"message":'success'},status.HTTP_201_CREATED)

    # to delete al the rquest log fot that post which get deactivated
    # if post delete the it this logs get deleted by it self
    def delete(self,request,post_id):

        post_obj = get_object_or_404(CollabrationEventPost,id=post_id)
        JoinRequestLog.objects.filter(event=post_obj).delete()

        return Response({"message":"deleted"},status.HTTP_200_OK)


from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from .models import OpenSourceProject
from .serializers import OpenSourceProjectSerializer

class OpenSourceProjectViewSet(viewsets.ModelViewSet):
    queryset = OpenSourceProject.objects.all().order_by('-created_at')
    serializer_class = OpenSourceProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.owner != self.request.user:
            raise PermissionDenied("You can only edit your own projects.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            raise PermissionDenied("You can only delete your own projects.")
        instance.delete()
