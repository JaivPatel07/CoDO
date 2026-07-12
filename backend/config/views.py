from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.views import APIView
from accounts.models import User
from profiles.models import UserProfile
from profiles.serializers import UserProfileSerializer
from rest_framework.response import Response
from rest_framework import status



class FetchPublicUserProfile(APIView):
    permission_classes = [AllowAny]

    def get(self,request,uname):
        try:
            udata = User.objects.get(username = uname)
            print(udata)
            data = UserProfile.objects.get(user_id=udata.id)
            # print(data)

            serializer = UserProfileSerializer(data)
            # print(serializer.data)

            serializer = UserProfileSerializer(data)

            response_data = serializer.data.copy()
            response_data["email"] = udata.email
            response_data["username"] = udata.username

            return Response(response_data, status=status.HTTP_200_OK)
        except (User.DoesNotExist, UserProfile.DoesNotExist):
            return Response({"message": "User profile not found"},status.HTTP_404_NOT_FOUND)