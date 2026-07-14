from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from rest_framework.permissions import AllowAny
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
        try:
            # Profile already exists -> Update it
            profile = OrganizationProfile.objects.get(user=request.user)
            serializer = OrganizationProfileSerializer(
                profile,
                data=request.data,
                partial=True
            )
            status_code = status.HTTP_200_OK

        except OrganizationProfile.DoesNotExist:
            # Profile doesn't exist -> Create it
            serializer = OrganizationProfileSerializer(data=request.data)
            status_code = status.HTTP_201_CREATED

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {
                    "message": "Profile saved successfully.",
                    "data": serializer.data,
                },
                status=status_code,
            )

        print(serializer.errors)   # <-- Add this

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublicOrganizationProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        try:
            profile = OrganizationProfile.objects.select_related("user").get(
                user__username=username
            )

            serializer = OrganizationProfileSerializer(profile)

            return Response(serializer.data)

        except OrganizationProfile.DoesNotExist:
            return Response(
                {"error": "Organization not found"},
                status=status.HTTP_404_NOT_FOUND
            )