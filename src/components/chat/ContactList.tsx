import { Contact, Conversation } from "@/types/message";
import { ContactItem } from "./ContactItem";
import { Input } from "@/components/ui/input";
import { Search, Users, Settings } from "lucide-react";
import { useState } from "react";
import { ContactSyncButton } from "@/components/contacts/ContactSyncButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ContactListProps {
  contacts: Contact[];
  conversations: Conversation[];
  selectedContactId: string | null;
  onSelectContact: (contactId: string) => void;
}

export const ContactList = ({ contacts, conversations, selectedContactId, onSelectContact }: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">QuickMessage</h1>
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => navigate('/settings')}
              title="Paramètres"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <ContactSyncButton />
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Users className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un groupe</DialogTitle>
                  <DialogDescription>
                    Fonctionnalité à venir : Créez des groupes de discussion avec vos contacts
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <ContactItem
            key={conversation.id}
            contact={conversation}
            isSelected={conversation.id === selectedContactId}
            onClick={() => onSelectContact(conversation.id)}
          />
        ))}
      </div>
    </div>
  );
};
