from django.urls import path
from .views import CreateUserProfile,FetchUserData

urlpatterns = [
    path('fetchUser/',FetchUserData.as_view(),name="create_user_profile"),
    path('createUserProfile/',CreateUserProfile.as_view(),name="create_user_profile")
]