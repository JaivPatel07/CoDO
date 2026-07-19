from django.urls import path
from .views import CollabrationView

urlpatterns = [
    path('getallpost/',CollabrationView.as_view()),
    path('createpost/',CollabrationView.as_view())
]