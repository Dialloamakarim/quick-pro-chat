import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ConversationWithDetails {
  id: string;
  name: string | null;
  is_group: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  last_message?: {
    content: string | null;
    created_at: string;
  };
  unread_count: number;
  participants: Array<{
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  }>;
  online?: boolean;
}

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // Get conversations where user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (participantError) throw participantError;

      const conversationIds = participantData.map(p => p.conversation_id);

      if (conversationIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Get conversation details
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // Get participants for each conversation
      const conversationsWithDetails = await Promise.all(
        conversationsData.map(async (conv) => {
          // Get participants
          const { data: participants } = await supabase
            .from('conversation_participants')
            .select(`
              user_id,
              profiles:user_id (
                id,
                full_name,
                avatar_url
              )
            `)
            .eq('conversation_id', conv.id)
            .neq('user_id', user.id);

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { data: participantInfo } = await supabase
            .from('conversation_participants')
            .select('last_read_at')
            .eq('conversation_id', conv.id)
            .eq('user_id', user.id)
            .single();

          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .gt('created_at', participantInfo?.last_read_at || new Date(0).toISOString());

          const participantProfiles = participants?.map((p: any) => ({
            id: p.profiles.id,
            full_name: p.profiles.full_name,
            avatar_url: p.profiles.avatar_url,
          })) || [];

          return {
            ...conv,
            last_message: lastMessage || undefined,
            unread_count: unreadCount || 0,
            participants: participantProfiles,
          };
        })
      );

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { conversations, loading, refetch: fetchConversations };
};
