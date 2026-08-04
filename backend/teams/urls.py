from django.urls import path
from .views import TeamView,TeamInviteLink


# -> event = collabration post

# -> on ui page team_id is send with post data
urlpatterns = [
    path('get/team/<int:team_id>',TeamView.as_view()),
    path('add/team/member/',TeamView.as_view()),
    path('delete/team/<int:team_id>/member/<str:member_username>/',TeamView.as_view()),
    path('get_invite_link/<int:team_id>/',TeamInviteLink.as_view()),
    path('verify_invite_link/',TeamInviteLink.as_view())
]