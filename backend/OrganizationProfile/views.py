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
            
            # Save username if organization_name is provided
            org_name = request.data.get("organization_name")
            if org_name:
                request.user.username = org_name
                request.user.save()

            serializer.save(user=request.user)
            return Response(
                {"message": "Profile created successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            profile = OrganizationProfile.objects.get(user=request.user)
            serializer = OrganizationProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                # Save username if organization_name is provided
                org_name = request.data.get("organization_name")
                if org_name:
                    request.user.username = org_name
                    request.user.save()

                serializer.save()
                return Response(
                    {"message": "Profile updated successfully.", "data": serializer.data},
                    status=status.HTTP_200_OK
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except OrganizationProfile.DoesNotExist:
            return Response(
                {"error": "Organization profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
