from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/auth/", include("accounts.urls")),
    path("api/user/", include("profiles.urls")),
    path("api/organization/", include("OrganizationProfile.urls")),
]