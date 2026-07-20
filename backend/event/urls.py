from django.urls import path
from .views import EventListCreateView, EventDetailUpdateDeleteView, TrackRegistrationClickView

urlpatterns = [
    path("", EventListCreateView.as_view(), name="event-list-create"),
    path("<int:pk>/", EventDetailUpdateDeleteView.as_view(), name="event-detail-update-delete"),
    path("<int:pk>/track-click/", TrackRegistrationClickView.as_view(), name="track-registration-click"),
]
