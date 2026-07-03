from django.urls import path
from .views import CreateUserProfile 

urlpatterns = [
    path('createUserProfile/',CreateUserProfile.as_view(),name="create_user_profile")
]