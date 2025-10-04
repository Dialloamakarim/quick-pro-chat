import { useState } from "react";
import { ContactList } from "@/components/chat/ContactList";
import { ChatArea } from "@/components/chat/ChatArea";
import { ThemeToggle } from "@/components/ThemeToggle";
import { mockContacts, mockMessages } from "@/data/mockData";
import { Message } from "@/types/message";

const Index = () => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);

  const handleSendMessage = (text: string) => {
    if (!selectedContactId) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "me",
      text,
      timestamp: new Date(),
      read: false,
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

  const selectedContact = mockContacts.find((c) => c.id === selectedContactId) || null;
  const currentMessages = selectedContactId ? messages[selectedContactId] || [] : [];

  return (
    <div className="flex h-screen overflow-hidden">
      <ThemeToggle />
      <div className="w-full md:w-96 flex-shrink-0">
        <ContactList
          contacts={mockContacts}
          selectedContactId={selectedContactId}
          onSelectContact={setSelectedContactId}
        />
      </div>
      <div className="flex-1">
        <ChatArea
          contact={selectedContact}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          onToggleRead={() => {}}
          onAddReaction={handleAddReaction}
        />
      </div>
    </div>
  );
};

export default Index;
