from django.urls import path
from .views import OrganizationProfileView

urlpatterns = [
    path("createOrganizationProfile/", OrganizationProfileView.as_view()),
]