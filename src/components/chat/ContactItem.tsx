import { Conversation, isGroup } from "@/types/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Users } from "lucide-react";

interface ContactItemProps {
  contact: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export const ContactItem = ({ contact, isSelected, onClick }: ContactItemProps) => {
  const isGroupConv = isGroup(contact);
  
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 hover:bg-muted/50 active:bg-muted active:scale-[0.98] ${
        isSelected ? "bg-muted" : ""
      }`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{contact.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
        </Avatar>
        {isGroupConv ? (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-accent border-2 border-background rounded-full flex items-center justify-center">
            <Users className="h-2.5 w-2.5 text-accent-foreground" />
          </div>
        ) : !isGroupConv && contact.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-online border-2 border-background rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm truncate text-foreground">{contact.name}</h3>
          {contact.lastMessageTime && (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(contact.lastMessageTime, { locale: fr, addSuffix: false })}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
          {contact.unreadCount && contact.unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground rounded-full h-5 min-w-[20px] flex items-center justify-center text-xs">
              {contact.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
