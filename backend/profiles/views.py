from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated,AllowAny
from cloudStorage.Cloudinary import upload_image

from .serializers import UserProfileSerializer,FetchSerializer,UserAccountSerializer
from .models import UserProfile,GitHubTokens
from accounts.models import User
from django.conf import settings

import os
import requests

class CreateUserProfile(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        # print(request.data)
        # to validate if user profile already exists
        # if profile already exists then it update it
        # else create new one 
        try:
            profile = UserProfile.objects.get(user_id=request.user.id)
            is_update = True
        except UserProfile.DoesNotExist:
            profile = None
            is_update = False

        # to create url for image
        image = request.FILES.get("profile_pic")
        
        if image:
            image_url = upload_image(image)
        else:
            image_url = profile.profile_pic if is_update else ""

        # to store profile url instead of profile pic 
        data = request.data.copy()
        data['profile_pic'] = image_url

        try:
            if is_update:
                serializer = UserProfileSerializer(profile, data=data, partial=True)
            else:
                serializer = UserProfileSerializer(data=data)

            if serializer.is_valid():
                serializer.save(user=request.user) # to send user data to save it as fk
                return Response({'message': 'success', 'profile': serializer.data}, status.HTTP_200_OK if is_update else status.HTTP_201_CREATED)
            
            print(serializer.errors)
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({'message': str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR)




class FetchUserData(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,user_name):
        print(request.user.id)
        data = User.objects.get(id = request.user.id)
        print(data.username)

        if data.username != user_name:
            return Response("UnAuthenticated",status.HTTP_401_UNAUTHORIZED)

        # to check weather the user is blocked or not 
        serializer = FetchSerializer(data)
        # print(serializer.data)

        if (serializer.data['is_active']):
            return Response(serializer.data,status.HTTP_200_OK)
        else:
            return Response('User Account Is Blocked',status.HTTP_401_UNAUTHORIZED)
        

class FetchUserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,user_name):
        try:
            data = UserProfile.objects.get(user_id=request.user.id)
            # print(data['email'])

            serializer = UserProfileSerializer(data)
            # print(serializer.data)

            if (serializer.data):
                return Response(serializer.data,status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({"message": "User profile not found"},status.HTTP_404_NOT_FOUND)


class UpdateUserAccount(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, user_name):
        if request.user.username != user_name:
            return Response({"detail": "UnAuthenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        if "is_active" in request.data:
            is_active_value = request.data.get("is_active")
            is_delete_request = is_active_value is False or str(is_active_value).lower() in {"false", "0", "no"}

            if is_delete_request:
                request.user.delete()
                return Response(
                    {"message": "Account deleted successfully."},
                    status=status.HTTP_200_OK,
                )

        payload = {
            "username": request.data.get("username", ""),
            "email": request.data.get("email", ""),
        }

        serializer = UserAccountSerializer(request.user, data=payload)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



import requests
class GithubLoginView(APIView):

    permission_classes = [IsAuthenticated]
    def post(self,request):

        code = request.data.get("code")

        token_url = "https://github.com/login/oauth/access_token"

        token_response = requests.post(
            token_url,
            headers={
                "Accept":"application/json"
            },
            data={
                "client_id":settings.GITHUB_CLIENT_ID,
                "client_secret":settings.GITHUB_CLIENT_SECRET,
                "code":code,
            }
        )

        token_json = token_response.json()

        # print("fjksdjfls:- ",token_json)

        access_token = token_json.get("access_token")

        github_user_response = requests.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json"
            }
        )
        github_user = github_user_response.json()
        GitHubTokens.objects.create(
            user = request.user,
            github_username = github_user["login"],
            access_token = token_json['access_token'],
            token_type = token_json['token_type']
        )
        return Response(status.HTTP_201_CREATED)
