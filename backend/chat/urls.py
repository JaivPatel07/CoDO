from django.urls import path
from .views import chatpage

urlpatterns = [
    path('',chatpage)
]