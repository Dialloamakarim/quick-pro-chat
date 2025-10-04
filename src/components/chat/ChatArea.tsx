import { Contact, Message } from "@/types/message";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { WelcomeScreen } from "./WelcomeScreen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Phone, Video } from "lucide-react";
import { makePhoneCall } from "@/utils/contactsManager";
import { useToast } from "@/hooks/use-toast";

interface ChatAreaProps {
  contact: Contact | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onToggleRead: (messageId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onBack?: () => void;
}

export const ChatArea = ({
  contact,
  messages,
  onSendMessage,
  onToggleRead,
  onAddReaction,
  onBack,
}: ChatAreaProps) => {
  const { toast } = useToast();

  const handlePhoneCall = () => {
    if (contact) {
      // Simulate a phone number - in real app, this would come from contact data
      const phoneNumber = "+33612345678";
      makePhoneCall(phoneNumber);
      toast({
        title: "Appel en cours",
        description: `Appel vers ${contact.name}...`,
      });
    }
  };

  if (!contact) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      <div className="flex items-center justify-between p-4 bg-background border-b border-border">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
          )}
          <div className="relative">
            <Avatar>
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback>{contact.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
            </Avatar>
            {contact.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-online border-2 border-background rounded-full" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{contact.name}</h2>
            <p className="text-xs text-muted-foreground">
              {contact.online ? "En ligne" : "Hors ligne"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePhoneCall}>
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === "me"}
            onAddReaction={onAddReaction}
          />
        ))}
      </div>

      <MessageInput onSend={onSendMessage} />
    </div>
  );
};
