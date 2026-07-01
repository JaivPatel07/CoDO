from django.urls import path

from .views import SignupView, LoginView,RefreshAccessToken

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshAccessToken.as_view())
]