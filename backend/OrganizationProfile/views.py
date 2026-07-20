from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from cloudStorage.Cloudinary import upload_image

from .models import OrganizationProfile
from .serializers import OrganizationProfileSerializer
from accounts.models import User


class OrganizationProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Profile already exists -> Update it
            profile = OrganizationProfile.objects.get(user_id=request.user.id)
            is_update = True
        except OrganizationProfile.DoesNotExist:
            profile = None
            is_update = False

        # to create url for image
        image = request.FILES.get("profile_pic")
        
        if image:
            try:
                image_url = upload_image(image)
            except Exception as e:
                return Response(
                    {"error": f"Image upload failed: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            image_url = profile.profile_pic if is_update else ""

        # to store profile url instead of profile pic file
        data = request.data.copy()
        data['profile_pic'] = image_url

        try:
            if is_update:
                serializer = OrganizationProfileSerializer(
                    profile,
                    data=data,
                    partial=True
                )
                status_code = status.HTTP_200_OK
            else:
                serializer = OrganizationProfileSerializer(data=data)
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

            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

