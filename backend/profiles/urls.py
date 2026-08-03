from django.urls import path
from .views import CreateUserProfile,FetchUserData,FetchUserProfile,GithubLoginView

urlpatterns = [
    path('<str:user_name>/fetchUser/',FetchUserData.as_view()),
    path('<str:user_name>/fetchProfile/',FetchUserProfile.as_view()),
    path('createUserProfile/',CreateUserProfile.as_view(),name="create_user_profile"),
    path("github/login/", GithubLoginView.as_view())
]