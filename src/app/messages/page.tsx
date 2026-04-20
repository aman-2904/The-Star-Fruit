"use client";

import { useState, useEffect, Suspense, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import { chatService, ADMIN_ID, Message as DbMessage } from "@/lib/chatService";

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatType = searchParams.get('type');
  const propertyId = searchParams.get('id');

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  
  const subscriptionRef = useRef<any>(null);

  // Initialize Session and Conversations
  useEffect(() => {
    async function init() {
      if (!supabase) return;
      
      const { data: { session: curSession } } = await supabase.auth.getSession();
      if (!curSession) {
        router.push("/login?redirect=/messages");
        return;
      }
      setSession(curSession);

      // Fetch enquiries to get Host details
      const { data: enquiries } = await supabase
        .from('property_enquiries')
        .select(`
          property_id,
          is_paid,
          properties (
            id,
            listing_title,
            host_id
          )
        `)
        .eq('user_id', curSession.user.id);

      const hostChats: any[] = [];

      // Add Admin chat placeholder (always there)
      hostChats.push({
        id: "admin-chat",
        name: "LuxeVillaz Support",
        lastMessage: "...",
        timestamp: new Date(),
        type: "admin",
        isLocked: false,
        status: "seen"
      });

      if (enquiries) {
        enquiries.forEach((enq: any) => {
          hostChats.push({
            id: `host-${enq.property_id}`,
            name: enq.properties?.listing_title ? `Host: ${enq.properties.listing_title}` : "Villa Host",
            lastMessage: enq.is_paid ? "Click to chat" : "Payment pending to unlock chat",
            timestamp: new Date(enq.created_at || Date.now()),
            type: "host",
            isLocked: !enq.is_paid,
            status: "delivered",
            host_id: enq.properties?.host_id,
            property_id: enq.property_id
          });
        });
      }

      setChats(hostChats);
      
      // Determine selection
      let initialChatId = "admin-chat";
      if (chatType === 'admin') initialChatId = "admin-chat";
      else if (chatType === 'host' && propertyId) initialChatId = `host-${propertyId}`;
      
      setSelectedChatId(initialChatId);
      setLoading(false);
    }

    init();
  }, [router]);

  // Handle Conversation Selection & Real-time
  useEffect(() => {
    if (!selectedChatId || !session) return;

    async function loadConversation() {
      const selectedChat = chats.find(c => c.id === selectedChatId);
      if (!selectedChat) return;

      const targetId = selectedChat.type === 'admin' ? ADMIN_ID : selectedChat.host_id;
      if (!targetId) return;

      const conv = await chatService.getOrCreateConversation(
        session.user.id,
        targetId,
        selectedChat.type,
        selectedChat.property_id
      );

      if (conv) {
        setCurrentConversation(conv);
        // Load messages
        const history = await chatService.getMessages(conv.id);
        const formattedHistory = history.map(m => ({
          id: m.id,
          senderId: m.sender_id,
          content: m.content,
          timestamp: new Date(m.created_at),
          status: m.is_read ? "seen" : "delivered"
        }));
        setMessages(formattedHistory);

        // Subscribe to real-time
        if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
        subscriptionRef.current = chatService.subscribeToMessages(conv.id, (payload: DbMessage) => {
          // Add if not already there (prevents duplicate from own send)
          setMessages(prev => {
            if (prev.find(p => p.id === payload.id)) return prev;
            return [...prev, {
              id: payload.id,
              senderId: payload.sender_id,
              content: payload.content,
              timestamp: new Date(payload.created_at),
              status: "delivered"
            }];
          });
        });
      }
    }

    loadConversation();

    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
    };
  }, [selectedChatId, session, chats]);

  const handleSendMessage = async (content: string) => {
    if (!currentConversation || !session) return;

    const sent = await chatService.sendMessage(
      currentConversation.id,
      session.user.id,
      content
    );

    if (sent) {
      // Optimistically add to UI if needed, but Realtime will also catch it
      // Let's add it manually for instant feel
      const newMessage = {
        id: sent.id,
        senderId: session.user.id,
        content,
        timestamp: new Date(),
        status: "sent"
      };
      setMessages(prev => {
        if (prev.find(p => p.id === sent.id)) return prev;
        return [...prev, newMessage];
      });

      // Update last message in sidebar
      setChats(prev => prev.map(chat => 
        chat.id === selectedChatId 
          ? { ...chat, lastMessage: content, timestamp: new Date() } 
          : chat
      ));
    }
  };

  const selectedChat = chats.find(c => c.id === selectedChatId);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col pt-20 bg-gray-50/50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></span>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Initializing Live Chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Navbar />
      
      <div className="flex-grow flex flex-col md:flex-row mt-0 pt-16 md:pt-[68px] overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar 
          chats={chats} 
          selectedChatId={selectedChatId || undefined} 
          onSelectChat={setSelectedChatId} 
        />

        {/* Main Area */}
        <div className="flex-grow flex flex-col min-w-0">
          <ChatWindow 
            chat={selectedChat} 
            messages={messages} 
            currentUserId={session?.user?.id}
          />
          
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={selectedChat?.isLocked} 
          />
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></span>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
