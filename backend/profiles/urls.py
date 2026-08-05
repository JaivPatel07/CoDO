from django.urls import path
from .views import (
    CreateUserProfile, FetchUserData, FetchUserProfile, GithubLoginView, UpdateUserAccount,
    ToggleSaveCollabPost, ToggleSaveEvent, ToggleSaveProject, FetchSavedItems
)

urlpatterns = [
    path('<str:user_name>/fetchUser/', FetchUserData.as_view()),
    path('<str:user_name>/fetchProfile/', FetchUserProfile.as_view()),
    path('<str:user_name>/account/', UpdateUserAccount.as_view(), name="update_user_account"),
    path('createUserProfile/', CreateUserProfile.as_view(), name="create_user_profile"),
    path("github/login/", GithubLoginView.as_view()),
    path("save/collab/", ToggleSaveCollabPost.as_view(), name="save-collab-post"),
    path("save/event/", ToggleSaveEvent.as_view(), name="save-event"),
    path("save/project/", ToggleSaveProject.as_view(), name="save-project"),
    path("saved-items/", FetchSavedItems.as_view(), name="fetch-saved-items"),
]