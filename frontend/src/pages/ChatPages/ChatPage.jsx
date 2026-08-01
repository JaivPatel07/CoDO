import React, { useState } from 'react';
import {
    Search, MessageSquare, Phone, Video,
    MoreVertical, Paperclip, Smile, Send, CheckCheck
} from 'lucide-react';

// --- DUMMY DATA ---
const DUMMY_DMS = [
    { id: 'dm1', name: 'Alice Smith', avatar: 'https://i.pravatar.cc/150?u=alice', lastMessage: 'That sounds great! See you then.', time: '10:32 AM', unread: 2, online: true },
    { id: 'dm2', name: 'Bob Johnson', avatar: 'https://i.pravatar.cc/150?u=bob', lastMessage: 'Can you send me the latest design files?', time: '09:15 AM', unread: 0, online: false },
    { id: 'dm3', name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?u=emma', lastMessage: 'Thanks for the help yesterday!', time: 'Yesterday', unread: 0, online: true },
    { id: 'dm4', name: 'David Lee', avatar: 'https://i.pravatar.cc/150?u=david', lastMessage: 'Let me check my schedule.', time: 'Yesterday', unread: 0, online: false },
];

const DUMMY_MESSAGES = [
    { id: 1, text: 'Hey, how is the new project coming along?', sender: 'them', time: '10:30 AM' },
    { id: 2, text: 'It\'s going well! Just finishing up the UI mockups.', sender: 'me', time: '10:31 AM' },
    { id: 3, text: 'That sounds great! See you then.', sender: 'them', time: '10:32 AM' },
];

export default function ChatPage() {
    // Set to null by default to show the empty/rough page
    const [activeChat, setActiveChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans text-zinc-900">

            {/* --- SIDEBAR (Left Portion) --- */}
            <div className="w-full md:w-[380px] flex-shrink-0 bg-white border-r border-zinc-200 flex flex-col h-full">

                {/* Sidebar Header */}
                <div className="p-3 border-b border-zinc-200">

                    {/* Search Bar */}
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
                    {DUMMY_DMS.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat)}
                            className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-zinc-50 last:border-0 ${activeChat?.id === chat.id ? 'bg-blue-50/50' : 'hover:bg-zinc-50'
                                }`}
                        >
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover bg-zinc-200" />
                                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${chat.online ? 'bg-green-500' : 'bg-zinc-300'}`}></div>
                            </div>

                            {/* Chat Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-sm font-semibold text-zinc-900 truncate">{chat.name}</h3>
                                    <span className="text-[11px] font-medium text-zinc-500 shrink-0">{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-zinc-500 truncate pr-2">{chat.lastMessage}</p>
                                    {chat.unread > 0 && (
                                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* --- MAIN CHAT AREA (Right Portion) --- */}
            <div className="hidden md:flex flex-1 flex-col h-full bg-white relative">

                {/* Check if a chat is selected, otherwise show empty state */}
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-[76px] px-6 border-b border-zinc-200 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 shrink-0">
                            <div className="flex items-center gap-4">
                                <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <h2 className="text-base font-bold text-zinc-900">{activeChat.name}</h2>

                                </div>
                            </div>

                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 space-y-6">
                            {/* Date Separator */}
                            <div className="flex justify-center">
                                <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
                            </div>

                            {DUMMY_MESSAGES.map((msg) => {
                                const isMe = msg.sender === 'me';
                                return (
                                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div
                                            className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[15px] ${isMe
                                                    ? 'bg-blue-600 text-white rounded-br-sm shadow-sm'
                                                    : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm shadow-sm'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1.5 px-1">
                                            <span className="text-[11px] font-medium text-zinc-400">{msg.time}</span>
                                            {isMe && <CheckCheck size={14} className="text-blue-500" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Message Input Area */}
                        <div className="p-3 bg-white border-t border-zinc-200 shrink-0">
                            <div className="flex items-end gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">

                                <textarea
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    rows={1}
                                    className="flex-1 resize-none bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none border-none focus:outline-none focus:ring-0 min-h-[24px] max-h-32 overflow-y-auto py-2"/>

                                <button
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${messageInput.trim()
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                                        }`}
                                    disabled={!messageInput.trim()}
                                >
                                    <Send size={18} />
                                </button>

                            </div>
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