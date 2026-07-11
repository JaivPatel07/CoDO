from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path("admin/", admin.site.urls),

    path("u/profile/<str:uname>", views.FetchPublicUserProfile.as_view()),

    path("api/auth/", include("accounts.urls")),
    path("api/user/", include("profiles.urls")),
    path("api/organization/", include("OrganizationProfile.urls")),
]