from django.urls import path,re_path
from .consumers import NotificationConsumer


# we wil redirect hre from asgi.py file 
# same as urls.py when http method is called we will redirect to main urls.py

# websocket_urlpatterns = [
#     path("ws/chat/", NotificationConsumerr.as_asgi()),
# ]


websocket_urlpatterns = [
    re_path(r"ws/notification/(?P<room_name>\w+)/$", NotificationConsumer.as_asgi()),
    # --> here room name is reciver username
]
