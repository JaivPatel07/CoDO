from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.views import APIView
from accounts.models import User
from profiles.models import UserProfile,GitHubTokens
from profiles.serializers import UserProfileSerializer
from rest_framework.response import Response
from rest_framework import status
from OrganizationProfile.models import OrganizationProfile
from OrganizationProfile.models import OrganizationProfileView
from OrganizationProfile.serializers import OrganizationProfileSerializer
from network.models import Network
from django.db.models import Q
import requests
from django.shortcuts import get_object_or_404
import json


def get_git_data(access_token):

    query = """
        query {
        viewer {
            login
            name
            avatarUrl
            bio
            url

            followers {
            totalCount
            }

            following {
            totalCount
            }

            repositories(
            first: 100
            ownerAffiliations: OWNER
            orderBy: {
                field: UPDATED_AT
                direction: DESC
            }
            ) {
            totalCount

            nodes {
                id
                name
                description
                url
                isPrivate
                isFork

                stargazerCount
                forkCount

                updatedAt
                createdAt

                primaryLanguage {
                name
                color
                }

                languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                    size
                    node {
                    name
                    color
                    }
                }
                }
            }
            }

            pinnedItems(first: 6) {
            nodes {
                ... on Repository {
                id
                name
                description
                url
                stargazerCount
                forkCount

                primaryLanguage {
                    name
                    color
                }
                }
            }
            }

            contributionsCollection {
            contributionCalendar {
                totalContributions

                weeks {
                contributionDays {
                    date
                    contributionCount
                    color
                }
                }
            }
            }
        }
        }
        """
    response = requests.post("https://api.github.com/graphql",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        json={"query": query},
        )

    if response.status_code != 200:
        return None
    data = response.json()
    if "errors" in data:
        print(data["errors"])
        return None

    return data

class FetchGitProfile(APIView):
    permission_classes = [AllowAny]

    def get(self,request,user_name):
        udata = get_object_or_404(User,username = user_name)
        is_exits = GitHubTokens.objects.filter(user=udata).exists()
        if is_exits:
            git_obj = get_object_or_404(GitHubTokens,user=udata)
            git_data = get_git_data(git_obj.access_token) 
            return Response(git_data,status.HTTP_200_OK)
        else:
            return Response({},status.HTTP_204_NO_CONTENT)

from network.models import OrganizationFollow
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

class FetchUserProfile(APIView):
    permission_classes = [AllowAny]

    def get(self,request,user_name):
        try:
            udata = get_object_or_404(User,username = user_name)

            # print("yyyyyyyyyyyyyyyyyyyyyyyyyyy:-",udata)

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

            # print(git_data)

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
