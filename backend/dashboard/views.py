from django.db.models import Q
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from event.models import Event
from network.models import Network
from profiles.models import UserProfile
from saved.models import SavedItem
from teams.models import Team, TeamMembers


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = UserProfile.objects.select_related('user').get(user=request.user)

        leader_teams = Team.objects.filter(leader=request.user)
        profile = UserProfile.objects.filter(user=request.user).first()
        today = timezone.now().date()

        member_team_ids = TeamMembers.objects.filter(
            member=request.user
        ).values_list("team_id", flat=True)

        teams = (
            Team.objects
            .filter(Q(leader=request.user) | Q(id__in=member_team_ids))
            .select_related("event")
            .distinct()
        )

        workspaces = []
        for team in teams:
            current_members = TeamMembers.objects.filter(team=team).count() + 1
            team_size = team.team_size or current_members
            progress = int((current_members / team_size) * 100) if team_size else 0
            event = team.event

            workspaces.append({
                "id": team.id,
                "title": event.title if event else (team.team_name or "Untitled workspace"),
                "type": ", ".join(team.roles) if team.roles else "Team",
                "progress": min(progress, 100),
                "members": current_members,
                "team_size": team_size,
                "members_required": team.members_required,
                "skills": team.skills or [],
                "roles": team.roles or [],
                "is_leader": team.leader_id == request.user.id,
                "event_id": event.id if event else None,
                "event_type": event.event_type if event else None,
                "event_mode": event.event_mode if event else None,
                "event_location": event.event_location if event else None,
                "start_date": event.start_date if event else None,
                "end_date": event.end_date if event else None,
                "is_open": event.status if event else False,
            })

        upcoming_events_count = Event.objects.filter(
            interests__student=request.user,
            event_date__gte=today
        ).distinct().count()

        connections_count = Network.objects.filter(
            Q(sender=request.user) | Q(receiver=request.user),
            status="accepted"
        ).count()

        saved_count = SavedItem.objects.filter(user=request.user).count()

        if workspaces:
            hero_message = "Continue building with your teams and discover new opportunities today."
        elif upcoming_events_count > 0:
            hero_message = (
                f"You have {upcoming_events_count} upcoming event"
                f"{'s' if upcoming_events_count > 1 else ''} lined up. Find a team and start collaborating."
            )
        else:
            hero_message = "Find teammates, join exciting projects, and start collaborating today."

        data = {
            "welcome": {
                "username": request.user.username,
                "firstname": profile.firstname if profile else request.user.username,
                "lastname": profile.lastname if profile else "",
                "profile_pic": profile.profile_pic if profile else "",
                "preferred_role": profile.preferred_role if profile else "",
                "college": profile.college if profile else "",
                "hero_message": hero_message,
            },
            "stats": {
                "workspaces": len(workspaces),
                "connections": connections_count,
                "upcoming_events": upcoming_events_count,
                "saved_items": saved_count,
            },
            "workspaces": workspaces,
        }

        return Response(data)
