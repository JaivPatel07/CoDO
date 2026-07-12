from django.urls import path

from .views import SignupView, LoginView,RefreshAccessToken,LogoutView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshAccessToken.as_view()),
    path("logout/", LogoutView.as_view()),

]