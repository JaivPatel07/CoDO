from django.urls import path
from .views import ChatView,ChatMessageView

urlpatterns = [
    # path('',chatpage) 
    path('chat/',ChatView.as_view()),
    path('message/<int:chat_id>/',ChatMessageView.as_view()),
    path('createmessage/',ChatMessageView.as_view())
]