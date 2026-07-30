from django.urls import path
from .views import NotificationView

urlpatterns = [
    path('notification/',NotificationView.as_view()),
    path('sendnotification/',NotificationView.as_view()),
]