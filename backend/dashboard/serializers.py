from rest_framework import serializers


class WorkspaceSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    type = serializers.CharField()
    progress = serializers.IntegerField()
    members = serializers.IntegerField()