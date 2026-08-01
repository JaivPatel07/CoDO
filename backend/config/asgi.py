import os

from channels.routing import ProtocolTypeRouter
from channels.routing import URLRouter

from django.core.asgi import get_asgi_application

from notification.routing import websocket_urlpatterns as notification_urls
from chat.routing import websocket_urlpatterns as chats_urls


# do connextion for websocket same as url connection in http

print("ASGI Loaded")

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings"
)

application = ProtocolTypeRouter({

    "http": get_asgi_application(),

    "websocket": URLRouter(
        notification_urls+chats_urls
    ),

})