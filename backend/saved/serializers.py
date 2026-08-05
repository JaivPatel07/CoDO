from rest_framework import serializers

from event.serializers import EventSerializer
from profiles.models import UserProfile
from teams.models import Team
from usercollabration.models import CollabrationEventPost
from usercollabration.serializers import OpenSourceProjectSerializer

from .models import SavedItem


class SavedCollabrationSerializer(serializers.ModelSerializer):
    owner_user_name = serializers.CharField(source="owner.username", read_only=True)
    owner_name = serializers.SerializerMethodField(read_only=True)
    owner_pic_url = serializers.SerializerMethodField(read_only=True)
    is_owner = serializers.SerializerMethodField(read_only=True)
    is_saved = serializers.SerializerMethodField(read_only=True)
    team_id = serializers.SerializerMethodField(read_only=True)
    team_size = serializers.SerializerMethodField(read_only=True)
    members_required = serializers.SerializerMethodField(read_only=True)
    skills = serializers.SerializerMethodField(read_only=True)
    roles = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CollabrationEventPost
        fields = [
            "id",
            "title",
            "description",
            "event_type",
            "event_mode",
            "event_location",
            "event_url",
            "start_date",
            "start_time",
            "end_date",
            "end_time",
            "status",
            "post_date",
            "owner",
            "owner_user_name",
            "owner_name",
            "owner_pic_url",
            "is_owner",
            "is_saved",
            "team_id",
            "team_size",
            "members_required",
            "skills",
            "roles",
        ]

    def _profile(self, obj):
        return UserProfile.objects.filter(user=obj.owner).first()

    def _team(self, obj):
        return Team.objects.filter(event=obj).first()

    def get_owner_name(self, obj):
        profile = self._profile(obj)
        if not profile:
            return obj.owner.username
        return f"{profile.firstname} {profile.lastname}".strip() or obj.owner.username

    def get_owner_pic_url(self, obj):
        profile = self._profile(obj)
        return profile.profile_pic if profile else ""

    def get_is_owner(self, obj):
        request = self.context.get("request")
        return bool(request and obj.owner_id == request.user.id)

    def get_is_saved(self, obj):
        return True

    def get_team_id(self, obj):
        team = self._team(obj)
        return team.id if team else None

    def get_team_size(self, obj):
        team = self._team(obj)
        return team.team_size if team else None

    def get_members_required(self, obj):
        team = self._team(obj)
        return team.members_required if team else None

    def get_skills(self, obj):
        team = self._team(obj)
        return (team.skills or []) if team else []

    def get_roles(self, obj):
        team = self._team(obj)
        return (team.roles or []) if team else []


class SavedItemSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    project = OpenSourceProjectSerializer(read_only=True)
    collabration = SavedCollabrationSerializer(read_only=True)

    class Meta:
        model = SavedItem
        fields = ["id", "item_type", "created_at", "event", "project", "collabration"]
