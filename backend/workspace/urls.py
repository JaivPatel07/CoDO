from django.urls import path
from .views import GrpChatView,WorkSpaceView

urlpatterns = [
    path('grp_chat/<int:team_id>/',GrpChatView.as_view()),
    path('workspace_team/',WorkSpaceView.as_view()),
    path('create_workspace_team/',WorkSpaceView.as_view())
]