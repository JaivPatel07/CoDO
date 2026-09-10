import os

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings"
)

from django.core.asgi import get_asgi_application

# Initialize Django BEFORE importing routing/consumers/models
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter
from channels.routing import URLRouter

from notification.routing import websocket_urlpatterns as notification_urls
from chat.routing import websocket_urlpatterns as chats_urls
from workspace.routing import websocket_urlpatterns as workspace_urls

# do connextion for websocket same as url connection in http

print("ASGI Loaded")

# os.environ.setdefault(
#     "DJANGO_SETTINGS_MODULE",
#     "config.settings"
# )

application = ProtocolTypeRouter({

    "http": get_asgi_application(),

    "websocket": URLRouter(
        notification_urls+chats_urls+workspace_urls
    ),

})