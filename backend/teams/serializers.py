from rest_framework import serializers
from .models import Team,TeamMembers

class TeamSerializer(serializers.ModelSerializer):

    class Meta:
        model = Team
        fields = "__all__"
        read_only_fields = ["leader", "event"]


    def validate(self, attrs):
        team_size = attrs.get("team_size")
        members_required = attrs.get("members_required")

        if team_size < 1:
            raise serializers.ValidationError({
                "team_size": "Team size must be greater than 0."
            })

        if members_required >= team_size:
            raise serializers.ValidationError({
                "members_required": "Required members cannot be greater than team size."
            })

        return attrs
    


class TeamMemberSerializer(serializers.ModelSerializer):

    class Meta:
        model = TeamMembers
        fields = "__all__"
        read_only_fields = ["team","member"]