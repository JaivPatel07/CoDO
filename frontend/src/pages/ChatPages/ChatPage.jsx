import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Search, MessageSquare, Send, CheckCheck, Loader2
} from 'lucide-react';
import { create_message, get_chat, get_message } from '../../api/chat_apis';
import ProfilePic from '../../components/ProfilePic';
import { UserContext } from '../../contextAPI/userContext';
import { useLocation } from 'react-router-dom';

export default function ChatPage() {
    const [chats, setChats] = useState([]);
    const [activeChatObj, setActiveChatObj] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);

    const { userData,profileData } = useContext(UserContext)
    const socketRef = useRef(null);

    const location = useLocation()
    const receiver = location.state?.receiver
    // console.log("receiver:- ",receiver)

    // 1. Fetch initial chat list
    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoadingChats(true);
                const response = await get_chat();
                // console.log(response.data)
                setChats(response.data || []);
                if (receiver) {
                    setChats(prev => [receiver,...prev])
                }
            } catch (err) {
                console.error('Error fetching chats:', err?.response || err);
                setError('Failed to load conversations.');
            } finally {
                setLoadingChats(false);
            }
        };

        fetchChats();
    }, []);

    // 2. Fetch messages whenever activeChatObj changes
    useEffect(() => {
        if (!activeChatObj?.id){
            setMessages([])
            return
        };

        const fetchOldMessages = async () => {
            // console.log(activeChatObj)
            try {
                setLoadingMessages(true);
                const response = await get_message(activeChatObj.id);
                // console.log(activeChatObj,response.data)
                setMessages(response.data || []);
                // console.log(response.data)
            } catch (err) {
                
                console.error('Error fetching messages:', err?.response || err);
            } finally {
                setLoadingMessages(false);
            }
        };
        fetchOldMessages();

        // to fetch current chat 
        const [user1, user2] = [activeChatObj?.user1 || profileData.user, activeChatObj.user2].sort()
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat_${user1}_${user2}/`)
        socketRef.current = socket
        socket.onmessage = function (event) {
            // console.log(event.data)
            setMessages(prev => [...prev, JSON.parse(event.data)]);
        }

    }, [activeChatObj]);

    const handleSendMessage = (e) => {
        e?.preventDefault();
        console.log(activeChatObj)

        if (!messageInput.trim() || !activeChatObj || sending) return;

        if (
            !socketRef.current ||
            socketRef.current.readyState !== WebSocket.OPEN
        ) {
            console.log("Socket is not connected");
            return;
        }

        const textToSend = messageInput.trim();

        socketRef.current.send(
            JSON.stringify({
                chat_id: activeChatObj?.id || -1,
                messanger_user:profileData.user,
                message: textToSend,
                reciever_username:activeChatObj.other_username
            })
        );

        setMessageInput("");
    };

    // Helper formatter for timestamp presentation
    const formatTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans text-zinc-900">

            {/* --- SIDEBAR (Left Portion) --- */}
            <div className="w-full md:w-[380px] flex-shrink-0 bg-white border-r border-zinc-200 flex flex-col h-full">

                {/* Sidebar Header */}
                <div className="p-3 border-b border-zinc-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {loadingChats ? (
                        <div className="flex items-center justify-center p-8 text-zinc-400">
                            <Loader2 className="animate-spin" size={24} />
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center text-sm text-red-500">{error}</div>
                    ) : chats.length === 0 ? (
                        <div className="p-4 text-center text-sm text-zinc-400">No chats available.</div>
                    ) : (Array.isArray(chats) &&
                        chats.map((chatItem,index) => {
                            const isSelected = activeChatObj?.id === chatItem.id;
                            return (
                                <div
                                    key={chatItem?.id || index}
                                    onClick={() => setActiveChatObj(chatItem)}
                                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-zinc-50 last:border-0 ${isSelected ? 'bg-blue-50/50' : 'hover:bg-zinc-50'
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <ProfilePic uname={chatItem.other_fullname} custom_pic_url={chatItem.other_profile_pic} className="w-12 h-12 rounded-full object-cover" />
                                    </div>

                                    {/* Chat Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-sm font-semibold text-zinc-900 truncate">
                                                {chatItem.other_fullname}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate">@{chatItem.other_username}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* --- MAIN CHAT AREA (Right Portion) --- */}
            <div className="hidden md:flex flex-1 flex-col h-full bg-white relative">

                {activeChatObj ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-[76px] px-6 border-b border-zinc-200 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 shrink-0">
                            <div className="flex items-center gap-4">
                                <ProfilePic uname={activeChatObj.other_fullname} custom_pic_url={activeChatObj.other_profile_pic} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <h2 className="text-base font-bold text-zinc-900">
                                        {activeChatObj.other_fullname || activeChatObj.other_username}
                                    </h2>
                                    <p className="text-xs text-zinc-500">@{activeChatObj.other_username}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 space-y-6">
                            {loadingMessages ? (
                                <div className="flex items-center justify-center h-full text-zinc-400">
                                    <Loader2 className="animate-spin" size={24} />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
                                    No messages yet. Say hi!
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    // Determines if the current message was sent by the active user
                                    const isMe = msg.messanger_user !== activeChatObj.other_username;

                                    return (
                                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div
                                                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[15px] ${isMe
                                                    ? 'bg-blue-600 text-white rounded-br-sm shadow-sm'
                                                    : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm shadow-sm'
                                                    }`}
                                            >
                                                {msg.message}
                                            </div>
                                            <div className="flex items-center gap-1 mt-1.5 px-1">
                                                <span className="text-[11px] font-medium text-zinc-400">
                                                    {formatTime(msg.message_at)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Message Input Area */}
                        <div className="p-3 bg-white border-t border-zinc-200 shrink-0">
                            <form onSubmit={handleSendMessage} className="flex items-end gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                                <textarea
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Type a message..."
                                    rows={1}
                                    className="flex-1 resize-none bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none border-none focus:outline-none focus:ring-0 min-h-[24px] max-h-32 overflow-y-auto py-2"
                                />

                                <button
                                    type="submit"
                                    disabled={!messageInput.trim() || sending}
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${messageInput.trim() && !sending
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                                        }`}
                                >
                                    {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    /* Default Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 space-y-4 bg-zinc-50">
                        <div className="w-24 h-24 bg-white border border-zinc-200 rounded-full flex items-center justify-center shadow-sm">
                            <MessageSquare size={40} className="text-zinc-300" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-zinc-700">Your Messages</h3>
                            <p className="text-sm font-medium mt-1">Select a chat from the sidebar to start messaging.</p>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}