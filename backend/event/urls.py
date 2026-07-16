from django.urls import path
from .views import EventListCreateView, EventDetailUpdateDeleteView

urlpatterns = [
    path("", EventListCreateView.as_view(), name="event-list-create"),
    path("<int:pk>/", EventDetailUpdateDeleteView.as_view(), name="event-detail-update-delete"),
]
