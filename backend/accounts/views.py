from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import SignupSerializer,LoginSerializer

from .JWT import generate_token

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # print(request.data)
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save() # it will call creat_user(create) function in serializer
            # --> it wiil return __str__() a unique value
            # so we can access it other filed by user.id,user.username

            refresh_token = generate_token(user)
            # print(user.id) 



            return Response(
                {
                    "message": "Created successful.",
                    'token':refresh_token
                },
                status=status.HTTP_201_CREATED,
            )
        # print(serializer)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            # print(serializer.data)

            user = serializer.validated_data['user']
            refresh_token = generate_token(user)

            return Response(
                {
                    "message": "Login successful.",
                    'token':refresh_token
                    
                },
                status=status.HTTP_200_OK,
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



# to store new access token 
class RefreshAccessToken(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.data.get("refresh")

        try:
            refresh_token = RefreshToken(refresh)

            return Response({
                "access": str(refresh_token.access_token)
            })

        except TokenError:
            return Response(
                {"error": "Refresh token expired"},
                status=401
            )




# working of access and refresh tokn :---
# first broweseer send access token then it validate
# if access token get's expired server send 401 
# then browser send refresh token 
# server check it and if it not get expires so server create new access token
# and send to brwoser
# if refresh token get expires we get logout 