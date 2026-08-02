# common mehod to send message in real time 
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def sendChatMessage(id,chat,messanger_username,message,message_at):

    # id = that message id 
    # chat = that chat table object 
    # messanger_user = username 

    channel_layer = get_channel_layer()
    print("sending message from:- ",messanger_username," to chat:- ",chat.id)
    print("grp_name:- ",f"chat_{chat.user1.id}_{chat.user2.id}")
    async_to_sync(channel_layer.group_send) (
        f"chat_{chat.user1.id}_{chat.user2.id}",
        {
            "type": "chat_message",
            "id":id,
            "chat":chat,
            "messanger_user":messanger_username,
            "message_at":message_at,
            "message":message,
        }
    )



# --> here room name is creted bu below formate 
# if userA send message to userB or reverse 
# it sort by username so 
# chat_userA_userB