from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from teams.models import Team,TeamMembers
from .models import GroupMessage,WorkSpace
from .serializers import WorkSpaceSerializer,GrpChatSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from teams.serializers import TeamSerializer
from usercollabration.models import CollabrationEventPost
from profiles.models import UserProfile
from accounts.models import User

# Create your views here.
class GrpChatView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,team_id):

        team_obj = get_object_or_404(Team,id=team_id)
        grp_obj = GroupMessage.objects.filter(team=team_obj)

        serializer = GrpChatSerializer(grp_obj,many=True)

        final_data = []
        for i in serializer.data:
            user_obj = User.objects.get(id = i['messanger_user'])
            profile_obj = UserProfile.objects.get(user = user_obj)

            temp = i
            temp['messanger_username'] = user_obj.username
            temp['messanger_fullname'] = f"{profile_obj.firstname} {profile_obj.lastname}"

            final_data.append(temp)

        return Response(final_data,status.HTTP_200_OK)


class WorkSpaceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):

        team_obj = Team.objects.filter(
            workspace_team__isnull=False
        ).filter(
            Q(leader=request.user) |
            Q(teammembers__member=request.user)
        ).distinct()


        serializer = TeamSerializer(team_obj,many=True)
        print("jfskfdjlsjdlfk:- ",serializer)

        final_data = []
        for i in serializer.data:
            temp = i
            workspace_obj = WorkSpace.objects.filter(team_id = i['id']).first()
            team_obj = Team.objects.get(id=i['id'])

            if team_obj.team_name:
                temp['title'] = team_obj.team_name
            else:
                event_obj = CollabrationEventPost.objects.get(id=i['event'])
                temp['title'] = event_obj.title
            temp['role'] = 'lead' if team_obj.leader.id == request.user.id else 'member'
            temp['membersCount'] = TeamMembers.objects.filter(team=team_obj).count()
            temp['workspace_id'] = workspace_obj.id
            final_data.append(temp)
        return Response(final_data,status.HTTP_200_OK)

    def post(self,request):

        team_id = request.data.get('team_id')
        is_team = Team.objects.filter(id=team_id).first()

        if is_team is not None:
            WorkSpace.objects.create(
                user=request.user,
                Team=is_team
            )
        else:
            team_name = request.data.get('team_name')
            team_obj = Team.objects.create(
                leader=request.user,
                team_name=team_name
            )
            WorkSpace.objects.create(
                user=request.user,
                team = team_obj
            )

        return Response({"message":'success'},status.HTTP_201_CREATED)





# useEffect(() => {

#     const fetch_teams = async () => {
#       try {
#         const response = await fetch_workspace_team()
#         console.log(response.data)
#       }
#       catch (err) {
#         console.log(err?.response)
#       }
#     }
#     fetch_teams()

#   },[])
