import { useState } from "react";
import { ContactList } from "@/components/chat/ContactList";
import { ChatArea } from "@/components/chat/ChatArea";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileOptimizations } from "@/components/MobileOptimizations";
import { NotificationSetup } from "@/components/NotificationSetup";
import { mockContacts, mockMessages, mockGroups } from "@/data/mockData";
import { Message, Conversation } from "@/types/message";
import { usePersistedMessages } from "@/hooks/usePersistedMessages";

const Index = () => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messages, setMessages] = usePersistedMessages(mockMessages);

  // Combine contacts and groups for display
  const allConversations: Conversation[] = [...mockContacts, ...mockGroups];

  const handleSendMessage = (text: string, imageUrl?: string, audioUrl?: string, location?: { latitude: number; longitude: number }) => {
    if (!selectedContactId) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "me",
      text,
      timestamp: new Date(),
      read: false,
      imageUrl,
      audioUrl,
      location,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage],
    }));

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [selectedContactId]: prev[selectedContactId].map((msg) =>
          msg.id === newMessage.id ? { ...msg, read: true } : msg
        ),
      }));
    }, 1000);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!selectedContactId) return;

    setMessages((prev) => ({
      ...prev,
      [selectedContactId]: prev[selectedContactId].map((msg) =>
        msg.id === messageId
          ? { ...msg, reactions: [...(msg.reactions || []), emoji] }
          : msg
      ),
    }));
  };

  const selectedContact = allConversations.find((c) => c.id === selectedContactId) || null;
  const currentMessages = selectedContactId ? messages[selectedContactId] || [] : [];

  return (
    <>
      <MobileOptimizations />
      <NotificationSetup />
      <div className="flex h-screen overflow-hidden bg-background">
        <ThemeToggle />
        {/* Mobile: Show contact list OR chat, not both */}
        <div className={`w-full md:w-96 flex-shrink-0 ${selectedContactId ? 'hidden md:block' : 'block'}`}>
          <ContactList
            contacts={mockContacts}
            conversations={allConversations}
            selectedContactId={selectedContactId}
            onSelectContact={setSelectedContactId}
          />
        </div>
        <div className={`flex-1 ${selectedContactId ? 'block' : 'hidden md:block'}`}>
          <ChatArea
            contact={selectedContact}
            messages={currentMessages}
            onSendMessage={handleSendMessage}
            onToggleRead={() => {}}
            onAddReaction={handleAddReaction}
            onBack={() => setSelectedContactId(null)}
          />
        </div>
      </div>
    </>
  );
};

export default Index;
