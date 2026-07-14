from django.urls import path
from .views import OrganizationProfileView
from .views import PublicOrganizationProfileView

urlpatterns = [
    path("profile/", OrganizationProfileView.as_view(), name="organization-profile"),
    path("<str:username>/", PublicOrganizationProfileView.as_view(), name="public-organization-profile"),
]