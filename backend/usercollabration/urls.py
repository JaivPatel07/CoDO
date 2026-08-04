from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CollabrationView,JoinRequestLogView, OpenSourceProjectViewSet

router = DefaultRouter()
router.register(r'opensource', OpenSourceProjectViewSet, basename='opensource')

urlpatterns = [
    path('getallpost/',CollabrationView.as_view()),
    path('createpost/',CollabrationView.as_view()),
    path('fetchjoinrequest/<int:event_id>/',JoinRequestLogView.as_view()),
    path('makejoinrequest/',JoinRequestLogView.as_view()),
    path('updatejoinstatus/',JoinRequestLogView.as_view()),
    path('deletepost/<int:event_id>/',CollabrationView.as_view()),
    path('', include(router.urls)),
]