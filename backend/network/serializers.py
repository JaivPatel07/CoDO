from rest_framework.serializers import ModelSerializer
from .models import Network

class NetworkSerializer(ModelSerializer):
    class Meta:
        model = Network
        fields = "__all__"