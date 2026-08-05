from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated
from .models import User, PasswordResetOTP
from .serializers import (
    SignupSerializer, LoginSerializer, ForgotPasswordSerializer,
    VerifyOTPSerializer, ResetPasswordSerializer,
)
from .utils import (
    generate_otp, hash_otp, verify_otp, otp_expiry, send_otp_email, generate_reset_token,
    hash_reset_token, verify_reset_token, reset_token_expiry,
)
from profiles.serializers import FetchSerializer

from django.utils import timezone

from .JWT import generate_token

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # print(request.data)
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            # print(serializer)
            user = serializer.save() # it will call creat_user(create) function in serializer
            # --> it wiil return __str__() a unique value
            # so we can access it other filed by user.id,user.username

            refresh_token = generate_token(user)
            print("fdskjjfksdjfklsjdkfjkasdfjl")
            return Response(
                {   "userdata":serializer.data,
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
            user_data = FetchSerializer(user).data

            return Response(
                {
                    "message": "Login successful.",
                    'token': refresh_token,
                    'user': user_data

                },
                status=status.HTTP_200_OK,
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Logout successful"},
                status=status.HTTP_205_RESET_CONTENT
            )

        except Exception:
            return Response(
                {"error": "Invalid refresh token"},
                status=status.HTTP_400_BAD_REQUEST
            )


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
                status=status.HTTP_401_UNAUTHORIZED
            )


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST,)

        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            # don't reveal whether the email exists.
            return Response(
                {'message' : 'If an account with this email exists, an OTP has been sent.'},
                status=status.HTTP_200_OK,
            )

        PasswordResetOTP.objects.filter(user=user, is_used=False).delete()

        otp = generate_otp()

        PasswordResetOTP.objects.create(
            user=user,
            otp_hash=hash_otp(otp),
            expires_at=otp_expiry(),
        )

        send_otp_email(user.email, otp)

        return Response(
            {'message' : 'OTP sent successfully.'},
            status=status.HTTP_200_OK,
        )


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        try:
            user = User.objects.get(email=email)

            reset = (
                PasswordResetOTP.objects
                .filter(user=user, is_used=False)
                .latest('created_at')
            )

        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):

            return Response(
                {'error' : 'Invalid OTP.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if reset.is_expired():
            reset.delete()

            return Response(
                {'error' : 'OTP has expired.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if reset.attempts >= 5:
            reset.delete()

            return Response(
                {'error' : 'Maximum OTP attempts exceeded.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not verify_otp(otp, reset.otp_hash):
            reset.attempts += 1
            reset.save()

            return Response(
                {'error' : 'Invalid OTP.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reset_token = generate_reset_token()

        reset.reset_token_hash = hash_reset_token(reset_token)
        reset.reset_token_expiry = reset_token_expiry()

        # reset.save()
        reset.save(update_fields=["reset_token_hash", "reset_token_expiry",])

        return Response(
            {
                'message' : 'OTP verified successfully.',
                'reset_token' : reset_token,
            },
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]
        reset_token = serializer.validated_data["reset_token"]
        password = serializer.validated_data["password"]

        try:
            user = User.objects.get(email=email)

            reset = (
                PasswordResetOTP.objects
                .filter(user=user, is_used=False)
                .latest('created_at')
            )

        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response(
                {'error' : 'Invalid password reset request.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if reset.reset_token_expiry is None:
            return Response(
                {'error' : 'Reset token not found.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if timezone.now() > reset.reset_token_expiry:
            reset.delete()

            return Response(
                {'error' : 'Reset token has expired.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not verify_reset_token(reset_token, reset.reset_token_hash):
            return Response(
                {'error' : 'Invalid reset token.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(password)
        user.save()

        reset.is_used = True
        reset.save(update_fields=["is_used"])

        return Response(
            {'message' : 'Password reset successfully.'},
            status=status.HTTP_200_OK,
        )



# it will send data to UserContext part.




# working of access and refresh tokn :---
# first broweseer send access token then it validate
# if access token get's expired server send 401 
# then browser send refresh token 
# server check it and if it not get expires so server create new access token
# and send to brwoser
# if refresh token get expires we get logout 
