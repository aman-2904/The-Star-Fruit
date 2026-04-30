"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import { chatService, Message as DbMessage } from "@/lib/chatService";

function AdminMessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get('userId');

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    async function init() {
      if (!supabase) return;
      
      const { data: { session: curSession } } = await supabase.auth.getSession();
      if (!curSession || curSession.user.user_metadata?.role !== 'admin') {
        router.push("/admin/login");
        return;
      }
      setSession(curSession);

      // 1. Fetch all 'admin' type conversations
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('*, properties(listing_title)')
        .eq('type', 'admin')
        .order('last_message_at', { ascending: false });

      if (convError) {
        console.error("Error fetching conversations:", convError);
        setLoading(false);
        return;
      }

      // 2. Fetch all enquiries to map user_id to names and properties
      const { data: enquiries } = await supabase
        .from('property_enquiries')
        .select('user_id, full_name, email, properties(listing_title)')
        .order('created_at', { ascending: false });

      // Create a map of user_id to name/email/inquiredProperties
      const userMap = new Map();
      enquiries?.forEach((enq: any) => {
        if (enq.user_id) {
          if (!userMap.has(enq.user_id)) {
            userMap.set(enq.user_id, { 
              name: enq.full_name, 
              email: enq.email,
              inquiredProperties: enq.properties?.listing_title ? [enq.properties.listing_title] : []
            });
          } else {
            // If they inquired about multiple properties, collect them
            const existing = userMap.get(enq.user_id);
            if (enq.properties?.listing_title && !existing.inquiredProperties.includes(enq.properties.listing_title)) {
              existing.inquiredProperties.push(enq.properties.listing_title);
            }
          }
        }
      });

      // Deduplicate conversations (group by user_id + property_id, keeping the latest one)
      const uniqueConversationsMap = new Map();
      (conversations || []).forEach(conv => {
        const uniqueKey = `${conv.user_id}-${conv.property_id || 'general'}`;
        if (!uniqueConversationsMap.has(uniqueKey)) {
          uniqueConversationsMap.set(uniqueKey, conv);
        } else {
          const existing = uniqueConversationsMap.get(uniqueKey);
          if (new Date(conv.last_message_at) > new Date(existing.last_message_at)) {
            uniqueConversationsMap.set(uniqueKey, conv);
          }
        }
      });

      const uniqueConversations = Array.from(uniqueConversationsMap.values());

      // 3. Format conversations for the sidebar
      const formattedChats = uniqueConversations.map(conv => {
        const userInfo = userMap.get(conv.user_id) || { name: `User ${conv.user_id.slice(0, 4)}`, email: 'Unknown', inquiredProperties: [] };
        
        let displayProperty = "General Inquiry";
        if (conv.properties?.listing_title) {
          displayProperty = conv.properties.listing_title;
        } else if (userInfo.inquiredProperties && userInfo.inquiredProperties.length > 0) {
          displayProperty = userInfo.inquiredProperties.join(', ');
        }

        return {
          id: conv.id,
          name: userInfo.name,
          email: userInfo.email,
          lastMessage: "...", // Will be updated if we wanted to fetch last message separately
          timestamp: new Date(conv.last_message_at),
          type: "admin",
          isLocked: false,
          status: "seen",
          user_id: conv.user_id,
          propertyName: displayProperty
        };
      });

      setChats(formattedChats);
      
      // Handle auto-selection via userId parameter
      if (userIdParam) {
        const targetChat = formattedChats.find(c => c.user_id === userIdParam);
        if (targetChat) {
          setSelectedChatId(targetChat.id);
        } else if (formattedChats.length > 0) {
          setSelectedChatId(formattedChats[0].id);
        }
      } else if (formattedChats.length > 0) {
        setSelectedChatId(formattedChats[0].id);
      }
      
      setLoading(false);
    }

    init();

    // Subscribe to all chat_messages globally for the admin to update the sidebar in real-time
    const allMsgsChannel = supabase.channel('all_admin_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, (payload) => {
        const newMsg = payload.new as any;
        setChats(prev => {
          // Check if this message belongs to a conversation in our sidebar
          const chatExists = prev.find(c => c.id === newMsg.conversation_id);
          if (chatExists) {
            return prev.map(chat => 
              chat.id === newMsg.conversation_id
                ? { ...chat, lastMessage: newMsg.content, timestamp: new Date(newMsg.created_at) }
                : chat
            ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          }
          // If it's a completely new conversation, the admin might need to refresh
          // or we could fetch the new conversation details here, but for simplicity we rely on refresh for brand new users.
          return prev;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(allMsgsChannel);
    };
  }, [router, userIdParam]);

  // Handle Conversation Selection & Real-time
  useEffect(() => {
    if (!selectedChatId || !session) return;

    async function loadConversation() {
      const conv = chats.find(c => c.id === selectedChatId);
      if (!conv) return;

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

    loadConversation();

    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
    };
  }, [selectedChatId, session]);

  const handleSendMessage = async (content: string) => {
    if (!currentConversation || !session) return;

    const sent = await chatService.sendMessage(
      currentConversation.id,
      session.user.id,
      content
    );

    if (sent) {
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
      <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-[#EC5B13] animate-spin"></span>
          <p className="text-gray-400 font-bold text-sm tracking-widest uppercase italic">Loading Admin Chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar 
          chats={chats} 
          selectedChatId={selectedChatId || undefined} 
          onSelectChat={setSelectedChatId} 
        />

        {/* Main Area */}
        <div className="flex-grow flex flex-col min-w-0 bg-gray-50/30">
          <ChatWindow 
            chat={selectedChat} 
            messages={messages} 
            currentUserId={session?.user?.id}
          />
          
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={!selectedChat} 
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center animate-pulse">Loading...</div>}>
      <AdminMessagesContent />
    </Suspense>
  );
}
