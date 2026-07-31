from django.urls import path
from .views import NetworkView

urlpatterns = [
    path('getnetworks/<str:user_name>/',NetworkView.as_view()),
    path('addnetworkrequest/',NetworkView.as_view()),
    path('updatenetworkrequest/',NetworkView.as_view()),
    path('removenetwork/<int:user_id>/',NetworkView.as_view()),
]
