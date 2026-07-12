from django.urls import path
from .views import CreateUserProfile,FetchUserData,FetchUserProfile

urlpatterns = [
    path('fetchUser/',FetchUserData.as_view()),
    path('fetchProfile/',FetchUserProfile.as_view()),
    path('createUserProfile/',CreateUserProfile.as_view(),name="create_user_profile"),
]