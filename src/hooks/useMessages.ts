import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MessageWithSender {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  image_url: string | null;
  audio_url: string | null;
  location_latitude: number | null;
  location_longitude: number | null;
  hidden: boolean;
  created_at: string;
  updated_at: string;
  sender: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  reactions?: Array<{
    id: string;
    emoji: string;
    user_id: string;
  }>;
}

export const useMessages = (conversationId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (!conversationId || !user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get reactions for each message
      const messagesWithReactions = await Promise.all(
        messagesData.map(async (msg: any) => {
          const { data: reactions } = await supabase
            .from('message_reactions')
            .select('id, emoji, user_id')
            .eq('message_id', msg.id);

          return {
            ...msg,
            reactions: reactions || [],
          };
        })
      );

      setMessages(messagesWithReactions);

      // Update last_read_at
      await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    if (!conversationId) return;

    // Subscribe to real-time message updates
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          fetchMessages();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  const sendMessage = async (
    content: string | null,
    imageUrl?: string,
    audioUrl?: string,
    location?: { latitude: number; longitude: number }
  ) => {
    if (!conversationId || !user) return;

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      image_url: imageUrl,
      audio_url: audioUrl,
      location_latitude: location?.latitude,
      location_longitude: location?.longitude,
    });

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    // Update conversation updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
  };

  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) return;

    const { error } = await supabase.from('message_reactions').insert({
      message_id: messageId,
      user_id: user.id,
      emoji,
    });

    if (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  };

  const hideMessage = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ hidden: true })
      .eq('id', messageId);

    if (error) {
      console.error('Error hiding message:', error);
      throw error;
    }
  };

  const deleteMessage = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    addReaction,
    hideMessage,
    deleteMessage,
    refetch: fetchMessages,
  };
};
