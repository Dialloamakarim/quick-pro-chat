import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ContactProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  username: string | null;
}

export const useContacts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<ContactProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          contact_user_id,
          profiles:contact_user_id (
            id,
            full_name,
            avatar_url,
            phone_number,
            username
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const contactProfiles = data.map((contact: any) => contact.profiles);
      setContacts(contactProfiles);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const addContact = async (contactUserId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('contacts').insert({
        user_id: user.id,
        contact_user_id: contactUserId,
      });

      if (error) throw error;
      await fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  };

  const removeContact = async (contactUserId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('user_id', user.id)
        .eq('contact_user_id', contactUserId);

      if (error) throw error;
      await fetchContacts();
    } catch (error) {
      console.error('Error removing contact:', error);
      throw error;
    }
  };

  const createConversation = async (contactUserId: string) => {
    if (!user) return null;

    try {
      // Check if conversation already exists
      const { data: existingParticipants } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (existingParticipants) {
        for (const participant of existingParticipants) {
          const { data: otherParticipant } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', participant.conversation_id)
            .neq('user_id', user.id)
            .single();

          if (otherParticipant?.user_id === contactUserId) {
            return participant.conversation_id;
          }
        }
      }

      // Create new conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          is_group: false,
          created_by: user.id,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: user.id },
          { conversation_id: conversation.id, user_id: contactUserId },
        ]);

      if (participantsError) throw participantsError;

      return conversation.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  };

  return {
    contacts,
    loading,
    addContact,
    removeContact,
    createConversation,
    refetch: fetchContacts,
  };
};
