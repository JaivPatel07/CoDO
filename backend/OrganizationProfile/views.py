from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import OrganizationProfile
from .serializers import OrganizationProfileSerializer


class OrganizationProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = OrganizationProfile.objects.get(user=request.user)
            serializer = OrganizationProfileSerializer(profile)
            return Response(serializer.data)
        except OrganizationProfile.DoesNotExist:
            return Response(
                {"error": "Organization profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    def post(self, request):
        serializer = OrganizationProfileSerializer(data=request.data)
        if serializer.is_valid():
            # Check if a profile already exists
            if OrganizationProfile.objects.filter(user=request.user).exists():
                return Response(
                    {"error": "Profile already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            serializer.save(user=request.user)
            return Response(
                {"message": "Profile created successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
