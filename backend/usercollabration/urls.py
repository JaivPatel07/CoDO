from django.urls import path
from .views import CollabrationView,JoinRequestLogView

urlpatterns = [
    path('getallpost/',CollabrationView.as_view()),
    path('createpost/',CollabrationView.as_view()),
    path('fetchjoinrequest/<int:event_id>/',JoinRequestLogView.as_view()),
    path('makejoinrequest/',JoinRequestLogView.as_view()),
    path('updatejoinstatus/',JoinRequestLogView.as_view()),
    path('deletepost/<int:event_id>/',CollabrationView.as_view())
]