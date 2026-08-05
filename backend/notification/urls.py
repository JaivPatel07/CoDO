from django.urls import path
from .views import NotificationView, MarkAllNotificationsRead

urlpatterns = [
    path('notification/',NotificationView.as_view()),
    path('sendnotification/',NotificationView.as_view()),
    path('mark-all-read/',MarkAllNotificationsRead.as_view()),
]
