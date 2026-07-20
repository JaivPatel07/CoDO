from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/user/<str:user_name>/profile/", views.FetchUserProfile.as_view()),
    path("api/organization/<str:organization_name>/profile/", views.FetchOrganizationProfile.as_view()),

    path("api/auth/", include("accounts.urls")),
    path("api/user/", include("profiles.urls")),
    path("api/organization/", include("OrganizationProfile.urls")),
    path("api/events/", include("event.urls")),

    # to list all the post from user side
    path("api/collabration/", include("usercollabration.urls")),
]