import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Search, MessageSquare, Send, CheckCheck, Loader2, AlertCircle, Trash2, X
} from 'lucide-react';
import { delete_message, get_chat, get_message } from '../../api/chat_apis';
import ProfilePic from '../../components/ProfilePic';
import { UserContext } from '../../contextAPI/userContext';
import { useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------
// Reusable Toast Component
// ----------------------------------------------------------------------
const Toast = ({ message, type }) => {
    if (!message) return null;
    const isError = type === 'error';

    return (
        <div className={`fixed top-6 right-6 px-5 py-3.5 rounded-2xl shadow-xl transition-all duration-300 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
            isError ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
        }`}>
            {isError ? <AlertCircle size={18} /> : <CheckCheck size={18} />}
            <span className="font-medium text-sm">{message}</span>
        </div>
    );
};

// ----------------------------------------------------------------------
// Main Chat Page Component
// ----------------------------------------------------------------------
export default function ChatPage() {
    // === EXACT EXISTING STATE ===
    let [chats, setChats] = useState([]);
    const [activeChatObj, setActiveChatObj] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);

    const { userData, profileData } = useContext(UserContext);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null); // Ref for auto-scrolling

    const location = useLocation();
    let receiver = location.state?.receiver;

    // === NEW UI STATE ===
    const [toast, setToast] = useState(null);

    // === ERROR HANDLING UTILITY ===
    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 1000);
    };

    const handleApiError = (err) => {
        const status = err?.response?.status;
        let msg = "Something went wrong.";
        
        if (status === 400) msg = "Bad request.";
        else if (status === 401) msg = "Session expired. Please login again.";
        else if (status === 403) msg = "Access denied.";
        else if (status === 404) msg = "Message not found.";
        else if (status === 500) msg = "Internal server error.";
        
        showToast(msg, 'error');
        console.log(err?.response);
    };

    // === EXISTING LOGIC ===
    // 1. Fetch initial chat list
    useEffect(() => {
        const fetchChats = async () => {
            setLoadingChats(true);
            try {
                const res = await get_chat();
                let list = res.data || [];

                if (receiver) {
                    const exists = list.some(
                        chat => chat.other_username === receiver.other_username
                    );

                    if (!exists) {
                        list = [receiver, ...list];
                    }
                    setActiveChatObj(receiver);
                }
                setChats(list);
            } catch (err) {
                handleApiError(err);
                setError("Failed to load chats.");
            } finally {
                setLoadingChats(false);
            }
        };
        fetchChats();
    }, []);

    // 2. Manage WebSocket and Active Chat Messages
    useEffect(() => {
        if (!activeChatObj) return;

        if (socketRef.current) {
            socketRef.current.close();
        }

        const [user1, user2] =
            activeChatObj.id
                ? [activeChatObj.user1, activeChatObj.user2].sort()
                : [profileData.user, receiver.user2].sort();

        const socket = new WebSocket(
            `ws://127.0.0.1:8000/ws/chat_${user1}_${user2}/`
        );

        socketRef.current = socket;

        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            setMessages(prev => [...prev, data]);

            if (!activeChatObj.id && data.chat_id) {
                try {
                    const res = await get_chat();
                    const newChat = res.data.find(
                        chat => chat.id === data.chat_id
                    );

                    if (newChat) {
                        setActiveChatObj(newChat);
                        setChats(prev => {
                            const withoutTemp =
                                prev.filter(
                                    c =>
                                        c.other_username !==
                                        receiver.other_username
                                );
                            return [newChat, ...withoutTemp];
                        });
                    }
                } catch (err) {
                    handleApiError(err);
                }
            }
        }

        if (activeChatObj.id) {
            setLoadingMessages(true);
            get_message(activeChatObj.id)
                .then(res => setMessages(res.data))
                .catch(err => handleApiError(err))
                .finally(() => setLoadingMessages(false));
        } else {
            setMessages([]);
        }
        return () => socket.close();
    }, [activeChatObj]);

    // 3. Auto Scroll to bottom whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 4. Delete Message
    const handleDeleteMessage = async (msg_id, d_type) => {
        try {
            await delete_message(msg_id, d_type);
            setMessages(prev => prev.filter(msg => msg.id !== msg_id));
            setSelectedMessageId(null);
            showToast("Message deleted.", "success");
        }
        catch (err) {
            handleApiError(err);
        }
    }

    // 5. Send Message
    const handleSendMessage = (e) => {
        e?.preventDefault();
        if (!messageInput.trim()) return;

        if (socketRef.current.readyState !== WebSocket.OPEN) return;

        setSending(true);
        try {
            socketRef.current.send(
                JSON.stringify({
                    chat_id: activeChatObj.id ?? -1,
                    messanger_user: profileData.user,
                    reciever_username: activeChatObj.other_username,
                    message: messageInput
                })
            );
            setMessageInput("");
        } catch (err) {
            showToast("Failed to send message", "error");
        } finally {
            setSending(false);
        }
    };

    // 6. Helper format time
    const formatTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // === UI RENDER ===
    return (
        <div className="flex h-[90vh] bg-[#F3F4F6] p-3 overflow-hidden font-sans text-gray-900">
            
            {/* Global Toast */}
            {toast && <Toast message={toast.message} type={toast.type} />}

            {/* Main Application Container */}
            <div className="flex w-full h-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100">

                {/* --- SIDEBAR --- */}
                <div className="w-full md:w-[340px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
                    
                    {/* Search Header */}
                    <div className="p-6 pb-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-11 pr-4 py-3 bg-[#F8F9FA] border-transparent rounded-2xl text-[15px] font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-gray-400 placeholder:font-normal"
                            />
                        </div>
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
                        {loadingChats ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
                                <Loader2 className="animate-spin text-blue-500" size={28} />
                                <span className="text-sm font-medium">Loading chats...</span>
                            </div>
                        ) : error ? (
                            <div className="p-4 text-center text-sm font-medium text-red-500 bg-red-50 rounded-2xl border border-red-100">{error}</div>
                        ) : chats.length === 0 ? (
                            <div className="p-4 text-center text-sm font-medium text-gray-400">No chats available.</div>
                        ) : (
                            chats.map((chatItem, index) => {
                                const isSelected = activeChatObj?.id === chatItem.id;
                                return (
                                    <div
                                        key={chatItem?.id || index}
                                        onClick={() => setActiveChatObj(chatItem)}
                                        className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 group ${
                                            isSelected 
                                                ? 'bg-blue-600 shadow-[0_8px_20px_rgba(37,99,235,0.2)] scale-[1.02]' 
                                                : 'bg-white border border-transparent hover:border-gray-200 hover:shadow-sm hover:scale-[1.01] hover:bg-[#F8F9FA]'
                                        }`}
                                    >
                                        <div className="relative shrink-0">
                                            <ProfilePic 
                                                uname={chatItem.other_fullname} 
                                                custom_pic_url={chatItem.other_profile_pic} 
                                                className={`w-12 h-12 rounded-full object-cover shadow-sm border-2 ${isSelected ? 'border-white/20' : 'border-white'}`} 
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-[15px] font-semibold truncate transition-colors ${isSelected ? 'text-white' : 'text-gray-900 group-hover:text-black'}`}>
                                                {chatItem.other_fullname}
                                            </h3>
                                            <p className={`text-[13px] truncate transition-colors ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                                                @{chatItem.other_username}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* --- MAIN CHAT AREA --- */}
                <div className="hidden md:flex flex-1 flex-col h-full bg-[#FCFCFD] relative">
                    {activeChatObj ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-[84px] px-8 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-xl z-10 shrink-0 sticky top-0 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
                                <div className="flex items-center gap-4">
                                    <ProfilePic 
                                        uname={activeChatObj.other_fullname} 
                                        custom_pic_url={activeChatObj.other_profile_pic} 
                                        className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm" 
                                    />
                                    <div>
                                        <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">
                                            {activeChatObj.other_fullname || activeChatObj.other_username}
                                        </h2>
                                        <p className="text-[13px] font-medium text-gray-500">@{activeChatObj.other_username}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Container (Centered Layout) */}
                            {/* FIX: Removed justify-end & min-h-full. Replaced with mt-auto on inner div so it properly scrolls */}
                            <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center">
                                <div className="w-full max-w-4xl space-y-8 flex flex-col mt-auto">
                                    {loadingMessages ? (
                                        <div className="flex flex-col items-center justify-center flex-1 text-gray-400 space-y-3">
                                            <Loader2 className="animate-spin text-blue-500" size={28} />
                                            <span className="text-sm font-medium">Loading messages...</span>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center flex-1 text-gray-400 space-y-4">
                                            <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm">
                                                <MessageSquare size={24} className="text-gray-300" />
                                            </div>
                                            <p className="text-[15px] font-medium text-gray-500">Say hi to start the conversation.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {messages.map((msg) => {
                                                const isMe = msg.messanger_user !== activeChatObj.other_username;

                                                return (
                                                    <div key={msg.id} className={`flex flex-col relative w-full ${isMe ? 'items-end' : 'items-start'}`}>
                                                        
                                                        {/* Message Bubble */}
                                                        <div
                                                            onDoubleClick={() => setSelectedMessageId(selectedMessageId === msg.id ? null : msg.id)}
                                                            className={`relative group max-w-[65%] px-5 py-3 text-[15px] leading-relaxed transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                                                                isMe
                                                                    ? 'bg-blue-600 text-white rounded-3xl rounded-tr-sm'
                                                                    : 'bg-white border border-gray-200 text-gray-800 rounded-3xl rounded-tl-sm'
                                                            }`}
                                                        >
                                                            {msg.message}
                                                            
                                                            <span className={`block text-[11px] font-medium mt-1.5 ${isMe ? 'text-blue-200 text-right' : 'text-gray-400 text-left'}`}>
                                                                {formatTime(msg.message_at)}
                                                            </span>
                                                        </div>

                                                        {/* Floating Delete Menu */}
                                                        {selectedMessageId === msg.id && (
                                                            <div className={`absolute top-full mt-2 z-20 bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-2xl p-1.5 min-w-[180px] flex flex-col gap-1 animate-in zoom-in-95 duration-200 ${isMe ? 'right-0 origin-top-right' : 'left-0 origin-top-left'}`}>
                                                                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-50 mb-1">
                                                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Options</span>
                                                                    <button onClick={() => setSelectedMessageId(null)} className="text-gray-400 hover:text-gray-600">
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDeleteMessage(msg.id, 'everyone')}
                                                                    className="flex items-center gap-2 text-left px-3 py-2.5 hover:bg-red-50 rounded-xl text-sm font-medium text-red-600 transition-colors"
                                                                >
                                                                    <Trash2 size={16} /> Delete for everyone
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteMessage(msg.id, 'me')}
                                                                    className="flex items-center gap-2 text-left px-3 py-2.5 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                                                                >
                                                                    <Trash2 size={16} /> Delete for me
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {/* Dummy div to scroll to bottom */}
                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Message Input Area (Centered Layout) */}
                            <div className="px-4 pb-6 pt-2 bg-gradient-to-t from-[#FCFCFD] to-transparent shrink-0 flex justify-center">
                                <div className="w-full max-w-4xl relative">
                                    <form onSubmit={handleSendMessage} className="flex items-end gap-3 rounded-[1.5rem] border border-gray-200 bg-white shadow-sm p-2 transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-[0_4px_20px_rgba(37,99,235,0.1)] focus-within:ring-4 focus-within:ring-blue-500/10">
                                        <textarea
                                            value={messageInput}
                                            onChange={(e) => {
                                                setMessageInput(e.target.value);
                                                e.target.style.height = 'auto';
                                                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                    e.target.style.height = 'auto';
                                                }
                                            }}
                                            placeholder="Type your message..."
                                            rows={1}
                                            className="flex-1 resize-none bg-transparent text-[15px] font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal outline-none border-none focus:outline-none focus:ring-0 min-h-[44px] max-h-[120px] overflow-y-auto px-4 py-3 leading-relaxed"
                                        />

                                        <button
                                            type="submit"
                                            disabled={!messageInput.trim() || sending}
                                            className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl transition-all duration-300 mb-0.5 ${
                                                messageInput.trim() && !sending
                                                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:scale-[1.05] hover:shadow-lg"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                            {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="ml-1" />}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                            <div className="w-24 h-24 bg-white border border-gray-100 rounded-[2rem] flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] transform transition-transform hover:scale-105 duration-300">
                                <MessageSquare size={40} className="text-blue-500" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Your Messages</h3>
                                <p className="text-[15px] font-medium text-gray-500">Select a conversation from the sidebar to start chatting.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}