"use client";

import { useEffect, useRef } from "react";
import { CheckCheck, Clock, Lock, ShieldCheck, User, UserCheck } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "seen";
}

interface ChatWindowProps {
  chat?: {
    id: string;
    name: string;
    type: "admin" | "host";
    isLocked: boolean;
    avatar?: string;
  };
  messages: Message[];
  currentUserId: string;
}

export default function ChatWindow({ chat, messages, currentUserId }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!chat) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-50/50 p-12 text-center h-full">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-black/5 flex items-center justify-center mb-6 animate-bounce duration-[2000ms]">
          <ShieldCheck size={48} className="text-blue-500" />
        </div>
        <h2 className="text-2xl font-serif text-gray-900 mb-2 tracking-tight">Select a conversation</h2>
        <p className="text-gray-500 max-w-xs font-medium">Your messages are secured with end-to-end encryption in the LuxeVillaz system.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col h-full bg-white relative overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
            chat.type === "admin" ? "bg-orange-50 border-orange-100" : "bg-blue-50 border-blue-100"
          }`}>
            {chat.avatar ? (
              <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              chat.type === "admin" ? <UserCheck className="text-orange-500" size={20} /> : <User className="text-blue-500" size={20} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-base">{chat.name}</h3>
              {!chat.isLocked && chat.type === "host" && (
                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-emerald-100">
                  <ShieldCheck size={10} /> Payment Verified
                </span>
              )}
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${chat.isLocked ? "bg-gray-300" : "bg-emerald-500 animate-pulse"}`}></span>
              {chat.isLocked ? "Locked" : "Online"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth bg-gray-50/20"
      >
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUserId;
          const showTime = index === 0 || 
            msg.timestamp.getTime() - messages[index-1].timestamp.getTime() > 300000; // 5 mins

          return (
            <div key={msg.id} className="flex flex-col">
              {showTime && (
                <div className="text-center my-6">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] bg-white px-4 py-1.5 rounded-full shadow-sm">
                    {msg.timestamp.toLocaleDateString([], { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                </div>
              )}
              <div className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2 group`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mb-1 border border-gray-200">
                    <User size={14} className="text-gray-400" />
                  </div>
                )}
                <div className="flex flex-col gap-1.5 max-w-[75%] md:max-w-[65%]">
                  <div className={`px-5 py-3 rounded-3xl text-[15px] font-medium leading-relaxed transition-all transform hover:scale-[1.01] ${
                    isMe 
                      ? "bg-blue-600 text-white rounded-br-md shadow-lg shadow-blue-600/10" 
                      : "bg-white text-gray-800 rounded-bl-md border border-gray-100 shadow-sm"
                  }`}>
                    {msg.content}
                  </div>
                  <div className={`flex items-center gap-1.5 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                    {isMe && (
                      <div className="scale-75 origin-left">
                        {msg.status === "seen" ? (
                          <CheckCheck className="text-blue-500" size={14} />
                        ) : msg.status === "delivered" ? (
                          <CheckCheck className="text-gray-300" size={14} />
                        ) : (
                          <Clock className="text-gray-300" size={14} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {chat.isLocked && (
          <div className="flex flex-col items-center justify-center p-12 bg-white/80 backdrop-blur-md rounded-[40px] border border-gray-100 shadow-xl shadow-black/5 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
              <Lock size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Chat with Host is Locked</h3>
            <p className="text-gray-500 text-center max-w-xs font-medium text-sm mb-8">
              Messaging with hosts will unlock automatically after your payment for the villa is verified.
            </p>
            <button className="bg-[#EC5B13] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:translate-y-[-2px] hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95 flex items-center gap-2">
              Complete Payment <ShieldCheck size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
