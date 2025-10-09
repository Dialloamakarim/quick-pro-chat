import { useState } from "react";
import { ContactList } from "@/components/chat/ContactList";
import { ChatArea } from "@/components/chat/ChatArea";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileOptimizations } from "@/components/MobileOptimizations";
import { NotificationSetup } from "@/components/NotificationSetup";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { useContacts } from "@/hooks/useContacts";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { conversations, loading: conversationsLoading } = useConversations();
  const { contacts } = useContacts();
  const {
    messages,
    loading: messagesLoading,
    sendMessage,
    addReaction,
    hideMessage,
    deleteMessage,
  } = useMessages(selectedConversationId);

  const handleSendMessage = async (
    text: string,
    imageUrl?: string,
    audioUrl?: string,
    location?: { latitude: number; longitude: number }
  ) => {
    try {
      await sendMessage(text || null, imageUrl, audioUrl, location);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    }
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    try {
      await addReaction(messageId, emoji);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la réaction",
        variant: "destructive",
      });
    }
  };

  const handleHideMessage = async (messageId: string) => {
    try {
      await hideMessage(messageId);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de masquer le message",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive",
      });
    }
  };

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) || null;

  // Transform conversations to match the expected format
  const transformedConversations = conversations.map((conv) => {
    const otherParticipant = conv.participants[0];
    
    return {
      id: conv.id,
      name: conv.is_group ? conv.name : otherParticipant?.full_name || 'Utilisateur',
      avatar: conv.is_group ? conv.avatar_url : otherParticipant?.avatar_url || '',
      lastMessage: conv.last_message?.content || '',
      timestamp: conv.last_message?.created_at || conv.created_at,
      unread: conv.unread_count,
      online: false,
      isGroup: conv.is_group,
    };
  });

  // Transform messages to match the expected format
  const transformedMessages = messages
    .filter((msg) => !msg.hidden)
    .map((msg) => ({
      id: msg.id,
      senderId: msg.sender_id,
      text: msg.content || '',
      timestamp: new Date(msg.created_at),
      read: true,
      imageUrl: msg.image_url || undefined,
      audioUrl: msg.audio_url || undefined,
      location: msg.location_latitude && msg.location_longitude
        ? {
            latitude: msg.location_latitude,
            longitude: msg.location_longitude,
          }
        : undefined,
      reactions: msg.reactions?.map((r) => r.emoji),
      hidden: msg.hidden,
    }));

  return (
    <>
      <MobileOptimizations />
      <NotificationSetup />
      <div className="flex h-screen overflow-hidden bg-background">
        <ThemeToggle />
        {/* Mobile: Show contact list OR chat, not both */}
        <div className={`w-full md:w-96 flex-shrink-0 ${selectedConversationId ? 'hidden md:block' : 'block'}`}>
          <ContactList
            contacts={contacts.map((c) => ({
              id: c.id,
              name: c.full_name || c.username || 'Utilisateur',
              avatar: c.avatar_url || '',
              phoneNumber: c.phone_number || '',
              online: false,
            }))}
            conversations={transformedConversations}
            selectedContactId={selectedConversationId}
            onSelectContact={setSelectedConversationId}
          />
        </div>
        <div className={`flex-1 ${selectedConversationId ? 'block' : 'hidden md:block'}`}>
          <ChatArea
            contact={selectedConversation ? {
              id: selectedConversation.id,
              name: selectedConversation.is_group 
                ? selectedConversation.name || 'Groupe'
                : selectedConversation.participants[0]?.full_name || 'Utilisateur',
              avatar: selectedConversation.is_group
                ? selectedConversation.avatar_url || ''
                : selectedConversation.participants[0]?.avatar_url || '',
              online: false,
            } : null}
            messages={transformedMessages}
            onSendMessage={handleSendMessage}
            onToggleRead={() => {}}
            onAddReaction={handleAddReaction}
            onHideMessage={handleHideMessage}
            onDeleteMessage={handleDeleteMessage}
            onBack={() => setSelectedConversationId(null)}
          />
        </div>
      </div>
    </>
  );
};

export default Index;
