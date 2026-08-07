from django.urls import path
from .views import ChatView,ChatMessageView,MarkChatReadView

urlpatterns = [
    # path('',chatpage) 
    path('chat/',ChatView.as_view()),
    path('message/<int:chat_id>/',ChatMessageView.as_view()),
    path('delete_message/<int:msg_id>/',ChatMessageView.as_view()),
    path('mark-read/<int:chat_id>/',MarkChatReadView.as_view())
]
