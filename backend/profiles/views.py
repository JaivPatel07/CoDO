from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated,AllowAny
from cloudStorage.Cloudinary import upload_image

from .serializers import UserProfileSerializer,FetchSerializer
from .models import UserProfile
from accounts.models import User

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

    def get(self,request):
        data = User.objects.get(id = request.user.id)
        # print(data)

        # to check weather the user is blocked or not 
        serializer = FetchSerializer(data)
        # print(serializer.data)

        if (serializer.data['is_active']):
            return Response(serializer.data,status.HTTP_200_OK)
        else:
            return Response('User Account Is Blocked',status.HTTP_401_UNAUTHORIZED)
        

class FetchUserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        try:
            data = UserProfile.objects.get(user_id=request.user.id)
            # print(data['email'])

            serializer = UserProfileSerializer(data)
            # print(serializer.data)

            if (serializer.data):
                return Response(serializer.data,status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({"message": "User profile not found"},status.HTTP_404_NOT_FOUND)
        