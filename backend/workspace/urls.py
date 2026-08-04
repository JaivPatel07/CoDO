from django.urls import path
from .views import GrpChatView,WorkSpaceView,ConnectRepositoryView,GithubPullRequests,GithubCommits,GithubIssues

urlpatterns = [
    path('grp_chat/<int:team_id>/',GrpChatView.as_view()),
    path('grp_chat_delete/<int:chat_id>/',GrpChatView.as_view()),
    path('workspace_team/',WorkSpaceView.as_view()),
    path('create_workspace_team/',WorkSpaceView.as_view()),
    path('get_workspace_repo/',ConnectRepositoryView.as_view()),
    path('connect_workspace_repo/',ConnectRepositoryView.as_view()),
    path('get_repo_pulls/',GithubPullRequests.as_view()),
    path('get_repo_commits/',GithubCommits.as_view()),
    path('get_repo_issues/',GithubIssues.as_view()),
]