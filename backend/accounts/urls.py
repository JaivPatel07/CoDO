from django.urls import path

from .views import ( SignupView, LoginView, RefreshAccessToken, LogoutView,
                    ForgotPasswordView, VerifyOTPView, ResetPasswordView )

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshAccessToken.as_view()),
    path("logout/", LogoutView.as_view()),

    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
]