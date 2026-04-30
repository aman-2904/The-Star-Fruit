"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import { chatService, Message as DbMessage, ADMIN_ID } from "@/lib/chatService";
import { MessageSquare } from "lucide-react";

interface Chat {
  id: string;
  name: string;
  email: string;
  lastMessage: string;
  timestamp: Date;
  type: string;
  isLocked: boolean;
  status: string;
  user_id: string;
  participant_id: string;
  property_id: string | null;
  propertyName: string;
  isPlaceholder?: boolean;
}

interface DisplayMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: string;
}

function HostMessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get('userId');
  const propertyIdParam = searchParams.get('propertyId');

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Chat | null>(null);
  
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    async function init() {
      if (!supabase) return;
      
      const { data: { session: curSession } } = await supabase.auth.getSession();
      if (!curSession) {
        router.push("/auth");
        return;
      }
      setSession(curSession);

      // 1. Fetch conversations where user is host (participant) or chatting with admin (user)
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('*, properties(listing_title)')
        .or(`participant_id.eq.${curSession.user.id},and(user_id.eq.${curSession.user.id},type.eq.admin)`)
        .order('last_message_at', { ascending: false });

      if (convError) {
        console.error("Error fetching conversations:", convError);
        setLoading(false);
        return;
      }

      // 2. Fetch all enquiries for properties owned by this host
      const { data: enquiries } = await supabase
        .from('property_enquiries')
        .select('*, properties!inner(listing_title, host_id)')
        .eq('properties.host_id', curSession.user.id)
        .order('created_at', { ascending: false });

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
            const existing = userMap.get(enq.user_id);
            if (enq.properties?.listing_title && !existing.inquiredProperties.includes(enq.properties.listing_title)) {
              existing.inquiredProperties.push(enq.properties.listing_title);
            }
          }
        }
      });

      // 3. Format existing conversations for sidebar
      const existingChats = (conversations || []).map(conv => {
        const isGuestChat = conv.type === 'host';
        
        let userInfo;
        if (isGuestChat) {
          userInfo = userMap.get(conv.user_id) || { name: `Guest ${conv.user_id.slice(0, 4)}`, email: 'Unknown' };
        } else {
          userInfo = { name: "LuxeVillaz Support", email: "admin@luxevillaz.com" };
        }

        return {
          id: conv.id,
          name: userInfo.name,
          email: userInfo.email,
          lastMessage: "...", 
          timestamp: new Date(conv.last_message_at),
          type: conv.type,
          isLocked: false,
          status: "seen",
          user_id: conv.user_id,
          participant_id: conv.participant_id,
          property_id: conv.property_id,
          propertyName: conv.properties?.listing_title || (isGuestChat ? "Property Inquiry" : "Support Chat")
        };
      });

      // 4. Add placeholders for enquiries that don't have conversations yet
      const finalChats = [...existingChats];
      enquiries?.forEach((enq: any) => {
        const hasConv = existingChats.find(c => c.user_id === enq.user_id && c.property_id === enq.property_id);
        if (!hasConv) {
          finalChats.push({
            id: `enquiry-${enq.id}`,
            name: enq.full_name,
            email: enq.email,
            lastMessage: enq.is_paid ? "Details unlocked. Click to start chatting!" : "Payment pending...",
            timestamp: new Date(enq.created_at),
            type: 'host',
            isLocked: !enq.is_paid,
            status: "delivered",
            user_id: enq.user_id,
            participant_id: curSession.user.id,
            property_id: enq.property_id,
            propertyName: enq.properties?.listing_title || "Property Inquiry",
            isPlaceholder: true
          });
        }
      });

      const sortedChats = finalChats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setChats(sortedChats);
      
      // Auto-selection logic
      if (userIdParam) {
        const targetChat = sortedChats.find(c => c.user_id === userIdParam && (!propertyIdParam || c.property_id === propertyIdParam));
        if (targetChat) {
          setSelectedChatId(targetChat.id);
        } else if (sortedChats.length > 0) {
          setSelectedChatId(sortedChats[0].id);
        }
      } else if (sortedChats.length > 0) {
        setSelectedChatId(sortedChats[0].id);
      }
      
      setLoading(false);
    }

    init();

    if (!supabase) return;

    // Global subscription to update sidebar
    const allMsgsChannel = supabase.channel('host_all_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, (payload) => {
        const newMsg = payload.new as any;
        setChats(prev => {
          const chatExists = prev.find(c => c.id === newMsg.conversation_id);
          if (chatExists) {
            return prev.map(chat => 
              chat.id === newMsg.conversation_id
                ? { ...chat, lastMessage: newMsg.content, timestamp: new Date(newMsg.created_at) }
                : chat
            ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          }
          return prev;
        });
      })
      .subscribe();

    return () => {
      if (supabase) supabase.removeChannel(allMsgsChannel);
    };
  }, [router, userIdParam, propertyIdParam]);

  // Handle Conversation Selection & Messages
  useEffect(() => {
    if (!selectedChatId || !session) return;

    async function loadConversation() {
      let chat = chats.find(c => c.id === selectedChatId);
      if (!chat) return;

      let realChatId = chat.id;

      // If it's a placeholder (enquiry without conversation), create it now
      if (chat.isPlaceholder) {
        const conv = await chatService.getOrCreateConversation(
          chat.user_id,
          chat.participant_id,
          'host',
          chat.property_id
        );
        
        if (conv) {
          realChatId = conv.id;
          // Update the chat in the sidebar list so it's no longer a placeholder
          setChats(prev => prev.map(c => c.id === selectedChatId ? { ...c, id: conv.id, isPlaceholder: false } : c));
          setSelectedChatId(conv.id);
          chat = { ...chat, id: conv.id, isPlaceholder: false };
        } else {
          return;
        }
      }

      setCurrentConversation(chat);
      
      const history = await chatService.getMessages(realChatId);
      const formattedHistory = history.map(m => ({
        id: m.id,
        senderId: m.sender_id,
        content: m.content,
        timestamp: new Date(m.created_at),
        status: m.is_read ? "seen" : "delivered"
      }));
      setMessages(formattedHistory);

      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
      subscriptionRef.current = chatService.subscribeToMessages(realChatId, (payload: DbMessage) => {
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

      setChats(prev => prev.map(chat => 
        chat.id === currentConversation.id 
          ? { ...chat, lastMessage: content, timestamp: new Date() } 
          : chat
      ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-160px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC5B13]"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex gap-6">
      <div className="w-80 shrink-0">
        <ChatSidebar 
          chats={chats} 
          selectedChatId={selectedChatId} 
          onSelectChat={setSelectedChatId} 
        />
      </div>
      
      <div className="flex-grow flex flex-col min-w-0 bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
        {selectedChatId ? (
          <>
            <ChatWindow 
              chat={chats.find(c => c.id === selectedChatId)} 
              messages={messages} 
              currentUserId={session?.user?.id}
            />
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-400 p-12">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your Inbox</h3>
            <p className="text-center max-w-xs font-medium text-sm">
              Select a conversation to start messaging with guests or support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HostMessagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HostMessagesContent />
    </Suspense>
  );
}


