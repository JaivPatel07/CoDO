from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse
from . import views
from network.views import FollowingOrganizationsView, OrganizationFollowersView, OrganizationFollowView

def health_check(request):
    return JsonResponse({"status" : "ok"})

urlpatterns = [
    path("health/", health_check),

    path("admin/", admin.site.urls),

    # this url is onyl to demo live chat usign socket
    path("chat/",include("chat.urls")),

    path("api/user/<str:user_name>/profile/", views.FetchUserProfile.as_view()),
    path("api/git/<str:user_name>/profile/", views.FetchGitProfile.as_view()),
    path("api/organization/<str:organization_name>/profile/", views.FetchOrganizationProfile.as_view()),

    path("api/auth/", include("accounts.urls")),
    path("api/user/", include("profiles.urls")),
    path("api/organization/", include("OrganizationProfile.urls")),
    path("api/organizations/<int:organization_id>/follow/", OrganizationFollowView.as_view()),
    path("api/organizations/<int:organization_id>/followers/", OrganizationFollowersView.as_view()),
    path("api/me/following-organizations/", FollowingOrganizationsView.as_view()),
    path("api/events/", include("event.urls")),

    # to list all the post from user side
    path("api/collabration/", include("usercollabration.urls")),
    path("api/notification/", include("notification.urls")),
    path("api/team/", include("teams.urls")),
    path("api/network/", include("network.urls")),
    path("api/chat/", include("chat.urls")),
    path("api/workspace/", include("workspace.urls")),
    path("api/support/bug-report/", views.BugReportView.as_view()),
    path("api/support/feedback/", views.FeedbackView.as_view()),
    path("api/dashboard/", include("dashboard.urls")),
    path("api/saved/", include("saved.urls")),
]
