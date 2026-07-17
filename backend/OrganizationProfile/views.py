from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import OrganizationProfile
from .serializers import OrganizationProfileSerializer
from accounts.models import User


class OrganizationProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Profile already exists -> Update it
            profile = OrganizationProfile.objects.get(user_id=request.user.id)
            # print(profile)
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
