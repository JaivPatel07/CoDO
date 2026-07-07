from django.urls import path
from .views import OrganizationProfileView

urlpatterns = [
    path("profile/", OrganizationProfileView.as_view(), name="organization-profile"),
]