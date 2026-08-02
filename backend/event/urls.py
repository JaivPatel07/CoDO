from django.urls import path
from .views import (
    EventDetailUpdateDeleteView,
    EventInterestView,
    EventListCreateView,
    OrganizationDashboardAnalyticsView,
    TrackRegistrationClickView,
)

urlpatterns = [
    path("", EventListCreateView.as_view(), name="event-list-create"),
    path("dashboard/analytics/", OrganizationDashboardAnalyticsView.as_view(), name="organization-dashboard-analytics"),
    path("<int:pk>/interest/", EventInterestView.as_view(), name="event-interest"),
    path("<int:pk>/track-click/", TrackRegistrationClickView.as_view(), name="track-registration-click"),
    path("<int:pk>/", EventDetailUpdateDeleteView.as_view(), name="event-detail-update-delete"),
]
