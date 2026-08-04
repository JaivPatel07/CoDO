from django.urls import re_path
from .consumers import WorkSpaceConsumer

websocket_urlpatterns = [
    re_path(r"ws/workshop_(?P<workshop_id>\w+)/$",WorkSpaceConsumer.as_asgi())
]