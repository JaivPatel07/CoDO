from django.shortcuts import render
from rest_framework.views import APIView,Response,status
from rest_framework.permissions import IsAuthenticated
from .models import Team,TeamMembers
from .serializers import TeamSerializer,TeamMemberSerializer
from django.shortcuts import get_object_or_404
from accounts.models import User
from profiles.models import UserProfile
from notification.SendNotification import SendNotificationMessage
from usercollabration.models import JoinRequestLog,CollabrationEventPost

# -> we will use username instead of user id bcz we made login with username

class TeamView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, team_id):

        team = get_object_or_404(
            Team,
            id=team_id
        )

        team_members = TeamMembers.objects.filter(team=team)

        is_member = team_members.filter(
            member=request.user
        ).exists()

        final_data = []
        if team.leader == request.user or is_member:

            # for leader
            profile_obj = UserProfile.objects.get(user=team.leader)
            leader_data = {
                "leader_name" : f"{profile_obj.firstname} {profile_obj.lastname}",
                "leader_pic_url" :profile_obj.profile_pic,
                "leader_user_name": team.leader.username
            }

            final_data.append(leader_data)

            serializer = TeamMemberSerializer(team_members, many=True)
            member_data = []
            for i in serializer.data:
                temp = {}
                profile_obj = UserProfile.objects.get(user=i["member"])
                user_obj = User.objects.get(id=i["member"])
                temp = {
                    "member_name": f"{profile_obj.firstname} {profile_obj.lastname}",
                    "member_pic_url": profile_obj.profile_pic,
                    "member_user_name": user_obj.username,
                    "joined_at": i["joined_at"],
                }
                
                member_data.append(temp)
            final_data.append(member_data)
            return Response(final_data, status=status.HTTP_200_OK)

        return Response({"message": "Unauthorized"},status=status.HTTP_401_UNAUTHORIZED)

# above method send respose in form of 
# [
#     {
        # team_details:{}like size,roles,skills,member_required
        #  }
#     {
#         team_leader_data:{}
#     },
#     {
#         team_member_data:[{},{}]
#     }
# ]


    def post(self,request):
        event_id = request.data["event_id"]
        action = request.data["action"]
        user_id = request.data["user_id"]
        team_id = request.data["team_id"]



        event_obj = get_object_or_404(CollabrationEventPost,id = event_id)

        if event_obj.owner != request.user:
            return Response({"message":'UnAuthorized'},status.HTTP_401_UNAUTHORIZED)

        log_obj = get_object_or_404(JoinRequestLog,event_id=event_id,user_id=user_id)

        type = ""
        # --> on action user a message that you are accepted or rejected
        team = get_object_or_404(Team,id=team_id)
        if action == "accept":
            try:
                TeamMembers.objects.create(
                    team = team,
                    member = User.objects.get(id=user_id)
                )
                team.members_required -= 1
                team.save()

                log_obj.status = "accepted"
                type = "team join"
                log_obj.save()
            except:
                return Response({"message":"unknow error"},status.HTTP_400_BAD_REQUEST)



        elif action == "reject":
            type = "message"
            log_obj.status = "rejected"
            log_obj.save()

        SendNotificationMessage(request.user,User.objects.get(id=user_id),type,f"your join request is {log_obj.status}",event_id,False)
        
        return Response({"message":"success"},status.HTTP_200_OK)

    
    def delete(self,request,team_id,member_username):

        team = get_object_or_404(Team,id=team_id)


        if team.leader != request.user:
            return Response({"message": "Unauthorized"},status=status.HTTP_401_UNAUTHORIZED)

        team.members_required += 1
        member = get_object_or_404(TeamMembers,team_id=team_id,member__username=member_username)
        log_obj = get_object_or_404(JoinRequestLog,event=team.event,user=member.member)

        log_obj.status = "rejected"
        SendNotificationMessage(request.user,member.member,"message","you are removed from team",None,False)
        log_obj.save()
        team.save()
        member.delete()


        return Response({"message": "Member deleted"},status.HTTP_200_OK)




# access:- 
# all members can veiw other team mates
# leader (creater of post on collabration pos page) can add and delete member 