from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from teams.models import Team,TeamMembers
from .models import GroupMessage,WorkSpace,WorkSpaceRepository
from .serializers import WorkSpaceSerializer,GrpChatSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from teams.serializers import TeamSerializer
from usercollabration.models import CollabrationEventPost
from profiles.models import UserProfile
from accounts.models import User
from profiles.models import GitHubTokens
import requests
from rest_framework.exceptions import ValidationError
from workspace.models import WorkSpaceRepository
from collections import defaultdict



# Create your views here.
class GrpChatView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,team_id):

        team_obj = get_object_or_404(Team,id=team_id)
        grp_obj = GroupMessage.objects.filter(team=team_obj)

        serializer = GrpChatSerializer(grp_obj,many=True)

        final_data = []
        for i in serializer.data:
            user_obj = User.objects.get(id = i['messanger_user'])
            profile_obj = UserProfile.objects.get(user = user_obj)
            temp = i
            temp['messanger_username'] = user_obj.username
            temp['messanger_fullname'] = f"{profile_obj.firstname} {profile_obj.lastname}"
            final_data.append(temp)

        return Response(final_data,status.HTTP_200_OK)

    def delete(self,request,chat_id):
        chat_obj = get_object_or_404(GroupMessage,id=chat_id)
        delete_type = request.data.get('delete_type')

        if delete_type == "me":
            chat_obj.delete_for_me = request.user
            chat_obj.save()

        if delete_type == "everyone":
            if chat_obj.messanger_user == request.user:
                chat_obj.delete()
            else:
                # Proper Error Message
                return Response(
                    {"message": "Unauthorized: You can only delete your own messages for everyone."}, 
                    status.HTTP_401_UNAUTHORIZED
                )

        # Proper Success Message
        return Response(
            {'message': 'Message deleted successfully.'}, 
            status.HTTP_200_OK
        )

class WorkSpaceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):

        team_obj = Team.objects.filter(
            workspace_team__isnull=False
        ).filter(
            Q(leader=request.user) |
            Q(teammembers__member=request.user)
        ).distinct()


        serializer = TeamSerializer(team_obj,many=True)
        print("jfskfdjlsjdlfk:- ",serializer)

        final_data = []
        for i in serializer.data:
            temp = i
            workspace_obj = WorkSpace.objects.filter(team_id = i['id']).first()
            team_obj = Team.objects.get(id=i['id'])

            if team_obj.team_name:
                temp['title'] = team_obj.team_name
            else:
                event_obj = CollabrationEventPost.objects.get(id=i['event'])
                temp['title'] = event_obj.title
            temp['role'] = 'lead' if team_obj.leader.id == request.user.id else 'member'
            temp['membersCount'] = TeamMembers.objects.filter(team=team_obj).count()
            temp['workspace_id'] = workspace_obj.id
            final_data.append(temp)
        return Response(final_data,status.HTTP_200_OK)

    def post(self,request):

        team_id = request.data.get('team_id')
        is_team = Team.objects.filter(id=team_id).first()

        if is_team is not None:
            WorkSpace.objects.create(
                user=request.user,
                Team=is_team
            )
        else:
            team_name = request.data.get('team_name')
            team_obj = Team.objects.create(
                leader=request.user,
                team_name=team_name
            )
            WorkSpace.objects.create(
                user=request.user,
                team = team_obj
            )

        return Response({"message":'success'},status.HTTP_201_CREATED)


class ConnectRepositoryView(APIView):
    permission_classes = [IsAuthenticated]


    def get(self,request):
        workspace_id = request.query_params.get("workspace_id")

        repo_obj = WorkSpaceRepository.objects.filter(workspace_id=workspace_id).first()
        print("xxxx:- ",repo_obj)
        if repo_obj is None:
            return Response({},status.HTTP_204_NO_CONTENT)
        return Response({
            "name": repo_obj.repo_name,
            "url": repo_obj.html_url,
            "private":repo_obj.private,
            "owner":repo_obj.owner
        })


    def post(self, request):
        # print("xxx:- ",request.data)
        workspace_id = request.data.get("workspace_id")
        repo_name = request.data.get("repo_name")
        private = request.data.get("private", False)

        if not repo_name:
            return Response(
                {"error": "Repository name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        github = GitHubTokens.objects.filter(user=request.user).first()

        if not github:
            return Response(
                {"error": "GitHub not connected"},
                status=status.HTTP_400_BAD_REQUEST
            )

        owner = github.github_username

        headers = {
            "Authorization": f"Bearer {github.access_token}",
            "Accept": "application/vnd.github+json"
        }

        # ----------------------------------
        # Check whether repo exists
        # ----------------------------------

        check_repo = requests.get(
            f"https://api.github.com/repos/{owner}/{repo_name}",
            headers=headers
        )

        # Existing repository
        if check_repo.status_code == 200:
            # print("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
            repo = check_repo.json()

        # Repository doesn't exist -> create it
        elif check_repo.status_code == 404:

            create_repo = requests.post(
                "https://api.github.com/user/repos",
                headers=headers,
                json={
                    "name": repo_name,
                    "private": private,
                    "auto_init": True
                }
            )

            if create_repo.status_code not in [201]:

                return Response(
                    create_repo.json(),
                    status=create_repo.status_code
                )

            repo = create_repo.json()
        else:

            return Response(
                check_repo.json(),
                status=check_repo.status_code
            )

        workspace = WorkSpace.objects.get(id=workspace_id)

        WorkSpaceRepository.objects.update_or_create(
            workspace=workspace,
            defaults={
                "github_repo_id": repo["id"],
                "repo_name": repo["name"],
                "full_name": repo["full_name"],
                "owner": repo["owner"]["login"],
                "private": repo["private"],
                "default_branch": repo["default_branch"],
                "html_url": repo["html_url"],
                "connected_by": request.user,
            }
        )

        return Response({
            "message": "Repository connected successfully.",
            "repository": {
                "name": repo["name"],
                "url": repo["html_url"],
                "private":repo['private'],
                "owner":repo["owner"]["login"]
            }
        })


def get_github_data(user, workspace_id):
    token = GitHubTokens.objects.filter(user=user).first()

    if not token:
        raise ValidationError("GitHub account not connected.")

    repo = WorkSpaceRepository.objects.filter(
        workspace_id=workspace_id
    ).first()

    if not repo:
        raise ValidationError("Repository not connected.")

    headers = {
        "Authorization": f"Bearer {token.access_token}",
        "Accept": "application/vnd.github+json"
    }

    return repo, headers


class GithubPullRequests(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        workspace_id = request.query_params.get('workspace_id')
        repo, headers = get_github_data(request.user, workspace_id)

        response = requests.get(
            f"https://api.github.com/repos/{repo.owner}/{repo.repo_name}/pulls",
            headers=headers,
            params={
                "state": "all"
            }
        )
        print("ssssssssssssssssssssssssss:- ",response)
        return Response(response.json(), status=response.status_code)

class GithubCommits(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        workspace_id = request.query_params.get('workspace_id')
        repo, headers = get_github_data(request.user, workspace_id)

        response = requests.get(
            f"https://api.github.com/repos/{repo.owner}/{repo.repo_name}/commits",
            headers=headers,
            params={
                "per_page":100
            }
        )
        
        return Response(response.json())


class GithubIssues(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        workspace_id = request.query_params.get('workspace_id')
        repo, headers = get_github_data(request.user, workspace_id)

        response = requests.get(
            f"https://api.github.com/repos/{repo.owner}/{repo.repo_name}/issues",
            headers=headers,
            params={"state": "open"}
        )

        if response.status_code != 200:
            return Response(response.json(), status=response.status_code)

        data = []

        for issue in response.json():

            if "pull_request" in issue:
                continue

            data.append({
                "id": issue["id"],
                "number": issue["number"],
                "title": issue["title"],
                "state": issue["state"],
                "created_at": issue["created_at"],
                "updated_at": issue["updated_at"],
                "user": issue["user"]["login"],
                "html_url": issue["html_url"],
            })

        return Response(data)