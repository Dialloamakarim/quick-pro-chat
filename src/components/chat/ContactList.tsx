import { Contact } from "@/types/message";
import { ContactItem } from "./ContactItem";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface ContactListProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (contactId: string) => void;
}

export const ContactList = ({ contacts, selectedContactId, onSelectContact }: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-4">QuickMessage</h1>
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
        {filteredContacts.map((contact) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            isSelected={contact.id === selectedContactId}
            onClick={() => onSelectContact(contact.id)}
          />
        ))}
      </div>
    </div>
  );
};
