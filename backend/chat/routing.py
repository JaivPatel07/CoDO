from django.urls import re_path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat_(?P<user_name_1>\w+)_(?P<user_name_2>\w+)/$",ChatConsumer.as_asgi())
]
