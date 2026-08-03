from django.urls import path
from .views import (
    ConnectionSuggestions,
    FollowingOrganizationsView,
    NetworkView,
    OrganizationFollowersView,
    OrganizationFollowView,
)

urlpatterns = [
    path('getnetworks/<str:user_name>/',NetworkView.as_view()),
    path('addnetworkrequest/',NetworkView.as_view()),
    path('updatenetworkrequest/',NetworkView.as_view()),
    path('removenetwork/<int:user_id>/',NetworkView.as_view()),
    path('suggestions/', ConnectionSuggestions.as_view()),
    path('organizations/<int:organization_id>/follow/', OrganizationFollowView.as_view()),
    path('organizations/<int:organization_id>/followers/', OrganizationFollowersView.as_view()),
    path('me/following-organizations/', FollowingOrganizationsView.as_view()),
]
