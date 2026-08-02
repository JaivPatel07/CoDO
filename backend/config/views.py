from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.views import APIView
from accounts.models import User
from profiles.models import UserProfile
from profiles.serializers import UserProfileSerializer
from rest_framework.response import Response
from rest_framework import status
from OrganizationProfile.models import OrganizationProfile
from OrganizationProfile.models import OrganizationProfileView
from OrganizationProfile.serializers import OrganizationProfileSerializer
from network.models import Network
from network.models import OrganizationFollow
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

class FetchUserProfile(APIView):
    permission_classes = [AllowAny]

    def get(self,request,user_name):
        try:
            udata = User.objects.get(username = user_name)
            print("yyyyyyyyyyyyyyyyyyyyyyyyyyy:-",udata)
            network_exits = Network.objects.filter(Q(receiver=udata) | Q(sender=udata))
            if network_exits:
                network_obj = Network.objects.filter(Q(receiver=udata) | Q(sender=udata)).first()

            # print(udata)
            data = UserProfile.objects.get(user_id=udata.id)
            # print(data)

            serializer = UserProfileSerializer(data)
            # print(serializer.data)

            serializer = UserProfileSerializer(data)

            response_data = serializer.data.copy()
            response_data["email"] = udata.email
            response_data["username"] = udata.username
            response_data["user_relation"] = "Connect" if not network_exits else "Connected" if network_obj.status=="accepted" else "Requested"

            return Response(response_data, status=status.HTTP_200_OK)
        except (User.DoesNotExist, UserProfile.DoesNotExist):
            return Response({"message": "User profile not found"},status.HTTP_404_NOT_FOUND)
        



class FetchOrganizationProfile(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, organization_name):
        # print('xxxxxxxxxxxcdsf')
        try:
            odata = User.objects.annotate(
                followers_count=Count("organization_followers")
            ).get(username=organization_name, is_student=False, is_active=True)
            
            profile = OrganizationProfile.objects.get(
                user_id = odata.id
            )

            if request.user.is_authenticated and request.user.id != odata.id:
                last_24_hours = timezone.now() - timedelta(hours=24)
                already_viewed = OrganizationProfileView.objects.filter(
                    organization=odata,
                    viewer=request.user,
                    viewed_at__gte=last_24_hours
                ).exists()
                if not already_viewed:
                    OrganizationProfileView.objects.create(
                        organization=odata,
                        viewer=request.user
                    )

            print(profile)

            serializer = OrganizationProfileSerializer(profile)
            response_data = serializer.data.copy()
            response_data["followers_count"] = odata.followers_count
            response_data["is_following"] = (
                request.user.is_authenticated
                and request.user.is_student
                and OrganizationFollow.objects.filter(
                    student=request.user,
                    organization=odata
                ).exists()
            )

            return Response(response_data)

        except (User.DoesNotExist, OrganizationProfile.DoesNotExist):
            return Response(
                {"error": "Organization not found"},
                status=status.HTTP_404_NOT_FOUND
            )
