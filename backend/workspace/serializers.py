from rest_framework import serializers
from .models import GroupMessage,WorkSpace


class GrpChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMessage
        fields = "__all__"
        read_only_fields = ['team','messanger_user','message_at','delete_for_me']

class WorkSpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSpace
        fields = "__all__"
        read_only_fields = ['user','team']

