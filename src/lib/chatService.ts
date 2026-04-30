import { supabase } from './supabase';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  id: string;
  user_id: string;
  participant_id: string;
  property_id?: string;
  type: 'admin' | 'host';
  last_message_at: string;
}

// Placeholder for Admin ID - this should ideally come from env or a settings table
export const ADMIN_ID = "00000000-0000-0000-0000-000000000000"; 

export const chatService = {
  /**
   * Get or create a conversation between a user and a participant (Host or Admin)
   */
  async getOrCreateConversation(userId: string, participantId: string, type: 'admin' | 'host', propertyId?: string) {
    if (!supabase) return null;

    // Try to find existing conversation
    let query = supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('participant_id', participantId)
      .eq('type', type);

    if (propertyId) {
      query = query.eq('property_id', propertyId);
    } else {
      // Explicitly check for null property_id to avoid matching other property chats
      query = query.is('property_id', null);
    }

    query = query.order('last_message_at', { ascending: false });

    const { data: existing, error: fetchError } = await query.limit(1).maybeSingle();

    if (existing) return existing as Conversation;

    // Create new conversation
    const { data: created, error: createError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        participant_id: participantId,
        type,
        property_id: propertyId
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating conversation:", createError);
      if (createError.code === '42P01') {
        console.error("HINT: The 'conversations' table does not exist. Please run the SQL setup script.");
      } else if (createError.code === '23503') {
        console.error("HINT: The participant_id (or user_id) does not exist in your users table. Check ADMIN_ID in chatService.ts.");
      }
      return null;
    }

    return created as Conversation;
  },

  /**
   * Fetch messages for a conversation
   */
  async getMessages(conversationId: string) {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    return data as Message[];
  },

  /**
   * Send a new message
   */
  async sendMessage(conversationId: string, senderId: string, content: string) {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return null;
    }

    // Update last_message_at in conversation
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data as Message;
  },

  /**
   * Subscribe to real-time messages for a conversation
   */
  subscribeToMessages(conversationId: string, onNewMessage: (message: Message) => void) {
    if (!supabase) return null;

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          onNewMessage(payload.new as Message);
        }
      )
      .subscribe();

    return channel;
  }
};
