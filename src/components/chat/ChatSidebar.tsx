"use client";

import { Check, CheckCheck, Lock, User, UserCheck } from "lucide-react";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount?: number;
  type: "admin" | "host";
  isLocked: boolean;
  avatar?: string;
  status: "delivered" | "seen" | "sent";
}

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId?: string;
  onSelectChat: (id: string) => void;
}

export default function ChatSidebar({ chats, selectedChatId, onSelectChat }: ChatSidebarProps) {
  return (
    <div className="w-full md:w-[350px] lg:w-[400px] border-r border-gray-100 bg-white flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Messages</h1>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold whitespace-nowrap">All</button>
          <button className="px-4 py-1.5 rounded-full bg-gray-50 text-gray-500 text-xs font-bold border border-gray-100 hover:bg-gray-100 transition-colors whitespace-nowrap">Unread</button>
          <button className="px-4 py-1.5 rounded-full bg-gray-50 text-gray-500 text-xs font-bold border border-gray-100 hover:bg-gray-100 transition-colors whitespace-nowrap">Admin</button>
          <button className="px-4 py-1.5 rounded-full bg-gray-50 text-gray-500 text-xs font-bold border border-gray-100 hover:bg-gray-100 transition-colors whitespace-nowrap">Hosts</button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        {chats.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full flex items-center gap-4 p-4 transition-all hover:bg-gray-50/80 active:scale-[0.98] ${
                  selectedChatId === chat.id ? "bg-blue-50/50 border-r-4 border-blue-500" : "bg-transparent"
                } ${chat.isLocked ? "opacity-60 grayscale-[0.5]" : ""}`}
              >
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${
                    chat.type === "admin" ? "bg-orange-50 border-orange-100" : "bg-blue-50 border-blue-100"
                  }`}>
                    {chat.avatar ? (
                      <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      chat.type === "admin" ? <UserCheck className="text-orange-500" size={24} /> : <User className="text-blue-500" size={24} />
                    )}
                  </div>
                  {chat.isLocked && (
                    <div className="absolute -bottom-1 -right-1 bg-gray-900 text-white p-1 rounded-full border-2 border-white shadow-sm">
                      <Lock size={12} />
                    </div>
                  )}
                  {chat.type === "admin" && !chat.isLocked && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white shadow-sm"></div>
                  )}
                </div>

                <div className="flex-grow text-left min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`text-[15px] font-bold truncate ${selectedChatId === chat.id ? "text-blue-600" : "text-gray-900"}`}>
                      {chat.name}
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                      {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate flex-grow ${chat.unreadCount ? "font-bold text-gray-900" : "text-gray-500 font-medium"}`}>
                      {chat.isLocked ? "Chat will unlock after payment" : chat.lastMessage}
                    </p>
                    {chat.unreadCount ? (
                      <span className="bg-blue-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {chat.unreadCount}
                      </span>
                    ) : (
                      <div className="shrink-0 scale-75 origin-right">
                        {chat.status === "seen" ? <CheckCheck className="text-blue-500" /> : <Check className="text-gray-300" />}
                      </div>
                    )}
                  </div>
                  
                  {chat.type === "admin" && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-widest rounded-md border border-orange-100">
                      Official Support
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center h-full">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <User size={32} className="text-gray-200" />
            </div>
            <p className="text-gray-400 font-bold">No messages found</p>
          </div>
        )}
      </div>
    </div>
  );
}
