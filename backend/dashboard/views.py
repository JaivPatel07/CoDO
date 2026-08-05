from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from profiles.models import UserProfile
from dashboard.serializers import WorkspaceSerializer
from teams.models import Team, TeamMembers

# Create your views here.
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = UserProfile.objects.select_related('user').get(user=request.user)

        leader_teams = Team.objects.filter(leader=request.user)

        member_team_ids = TeamMembers.objects.filter(
            member=request.user
        ).values_list("team_id", flat=True)

        member_teams = Team.objects.filter(id__in=member_team_ids)


        teams = (leader_teams | member_teams).distinct()

        workspaces = []

        for team in teams:
            current_members = TeamMembers.objects.filter(team=team).count() + 1
            progress = int((current_members / team.team_size) * 100)

            workspaces.append({
                'id' : team.id,
                'title' : team.event.title,
                'type' : ', '.join(team.roles) if team.roles else 'Team',
                'progress' : progress,
                'members' : current_members,
            })

        # Temporary logic (later replace with real queries)
        has_active_team = False
        upcoming_events = 0
        suggested_connections = 3

        if has_active_team:
            hero_message = "Continue building with your teams and discover new opportunities today."
        elif upcoming_events > 0:
            hero_message = f"You have {upcoming_events} upcoming event{'s' if upcoming_events > 1 else ''} and {suggested_connections} new collaboration opportunities."
        else:
            hero_message = "Find teammates, join exciting projects, and start collaborating today."

        serializer = WorkspaceSerializer(workspaces, many=True)

        data = {
            'welcome' : {
                'username' : request.user.username,
                'firstname' : profile.firstname,
                'lastname' : profile.lastname,
                'profile_pic' : profile.profile_pic,
                'preferred_role' : profile.preferred_role,
                'college' : profile.college,
                'hero_message' : hero_message,
            },
            'workspaces' : serializer.data,
        }

        return Response(data)