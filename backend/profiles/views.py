from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated
from cloudStorage.Cloudinary import upload_image

from .serializers import UserProfileSerializer
from .models import UserProfile
from PIL import Image
import json


class CreateUserProfile(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        # print(request.user.id)

        # to validate that user profile already exits or not 
        get_data = UserProfile.objects.filter(user_id=request.user.id)

        if (get_data):
            return Response({'message':"Profile Exits!!!"},status.HTTP_208_ALREADY_REPORTED)

        # to create url for image
        image = request.FILES.get("profile_pic")
        
        image_url = upload_image(image)
        # print(image_url)

        # to store profile url instead of profile pic 
        request.data['profile_pic'] = image_url

        try:
            serializer = UserProfileSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user) #to send user data to save it as fk
                return Response({'message':'success'},status.HTTP_201_CREATED)
            

            print(serializer.error_messages)
            return Response(serializer.errors,status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message':"Profile Exits!!!"},status.HTTP_208_ALREADY_REPORTED)
