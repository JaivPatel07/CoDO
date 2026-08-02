from django.urls import path
from .views import (
    EventDetailUpdateDeleteView,
    EventListCreateView,
    OrganizationDashboardAnalyticsView,
    TrackRegistrationClickView,
)

urlpatterns = [
    path("", EventListCreateView.as_view(), name="event-list-create"),
    path("dashboard/analytics/", OrganizationDashboardAnalyticsView.as_view(), name="organization-dashboard-analytics"),
    path("<int:pk>/", EventDetailUpdateDeleteView.as_view(), name="event-detail-update-delete"),
    path("<int:pk>/track-click/", TrackRegistrationClickView.as_view(), name="track-registration-click"),
]
