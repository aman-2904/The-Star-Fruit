"use client";

import { useState, useRef } from "react";
import { Send, Plus, Smile, Image as ImageIcon, MapPin, Mic } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
    setMessage(target.value);
  };

  return (
    <div className="p-4 md:p-6 bg-white border-t border-gray-50 border-t-transparent relative z-20">
      <div className={`max-w-4xl mx-auto flex items-end gap-2 md:gap-4 p-2 md:p-3 rounded-[32px] border transition-all ${
        disabled 
          ? "bg-gray-50 border-gray-100 opacity-50" 
          : "bg-white border-gray-200 shadow-sm focus-within:shadow-xl focus-within:shadow-blue-500/5 focus-within:border-blue-200"
      }`}>
        <button 
          disabled={disabled}
          className="p-2 md:p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all shrink-0"
        >
          <Plus size={20} />
        </button>

        <div className="flex-grow relative flex items-center">
          <textarea
            ref={inputRef}
            rows={1}
            value={message}
            onChange={adjustHeight}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? "Chat is locked" : "Type a message..."}
            className="w-full bg-transparent border-none focus:ring-0 text-[15px] font-medium text-gray-800 placeholder-gray-400 py-2.5 resize-none max-h-[120px] scrollbar-hide"
          />
          {!message && !disabled && (
            <div className="absolute right-0 flex items-center gap-1 md:gap-2">
              <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors"><Smile size={18} /></button>
              <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><ImageIcon size={18} /></button>
              <button className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"><MapPin size={18} /></button>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          className={`p-3 md:p-4 rounded-2xl md:rounded-3xl transition-all flex items-center justify-center shrink-0 ${
            !message.trim() || disabled
              ? "bg-gray-100 text-gray-300"
              : "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95"
          }`}
        >
          <Send size={18} strokeWidth={2.5} className={message.trim() && !disabled ? "animate-in slide-in-from-left-2" : ""} />
        </button>
      </div>
      
      {!disabled && (
        <div className="max-w-4xl mx-auto mt-3 flex justify-center gap-6 px-4">
          <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">
            <Mic size={12} /> Voice message
          </button>
          <div className="w-1 h-1 rounded-full bg-gray-200 mt-1.5"></div>
          <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors">
            Help center
          </button>
        </div>
      )}
    </div>
  );
}
