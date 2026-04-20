-- Run this in your Supabase SQL Editor

-- 1. Create Conversations Table
-- We removed strict REFERENCES auth.users(id) to allow placeholder IDs (like Admin) during setup
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID, 
    participant_id UUID,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    type TEXT CHECK (type IN ('admin', 'host')),
    last_message_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false
);

-- 3. Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 4. Conversations Policies
CREATE POLICY "Users can view their own conversations" 
ON public.conversations FOR SELECT 
USING (
    auth.uid() = user_id 
    OR auth.uid() = participant_id
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Users can create conversations" 
ON public.conversations FOR INSERT 
WITH CHECK (auth.uid() = user_id OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- 5. Chat Messages Policies
CREATE POLICY "Users can view messages in their conversations" 
ON public.chat_messages FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.conversations 
        WHERE id = chat_messages.conversation_id 
        AND (
            auth.uid() = user_id 
            OR auth.uid() = participant_id
            OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
        )
    )
);

CREATE POLICY "Users can send messages to their conversations" 
ON public.chat_messages FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.conversations 
        WHERE id = chat_messages.conversation_id 
        AND (
            auth.uid() = user_id 
            OR auth.uid() = participant_id
            OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
        )
    )
);

-- 6. Enable Realtime
-- In Supabase UI: Database -> Replication -> Source: realtime -> Add chat_messages
