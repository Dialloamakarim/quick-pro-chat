import { Message } from "@/types/message";
import { Check, CheckCheck, Smile } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export const MessageBubble = ({ message, isOwn, onAddReaction }: MessageBubbleProps) => {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}>
      <div className="relative max-w-[70%]">
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? "bg-bubble-sent text-bubble-sent-text rounded-br-sm"
              : "bg-bubble-received text-bubble-received-text rounded-bl-sm"
          }`}
        >
          {message.imageUrl && (
            <img 
              src={message.imageUrl} 
              alt="Shared image" 
              className="max-w-xs rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.imageUrl, '_blank')}
            />
          )}
          {message.audioUrl && (
            <audio 
              controls 
              src={message.audioUrl}
              className="max-w-xs mb-2"
              preload="metadata"
            />
          )}
          {message.location && (
            <div className="mb-2">
              <iframe
                width="300"
                height="200"
                frameBorder="0"
                style={{ border: 0, borderRadius: '8px' }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${message.location.longitude - 0.01},${message.location.latitude - 0.01},${message.location.longitude + 0.01},${message.location.latitude + 0.01}&layer=mapnik&marker=${message.location.latitude},${message.location.longitude}`}
                title="Location map"
              />
              <a
                href={`https://www.google.com/maps?q=${message.location.latitude},${message.location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline opacity-70 hover:opacity-100 block mt-1"
              >
                Ouvrir dans Google Maps
              </a>
            </div>
          )}
          <p className="text-sm break-words">{message.text}</p>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-xs opacity-70">
              {format(message.timestamp, "HH:mm", { locale: fr })}
            </span>
            {isOwn && (
              <div className="text-accent">
                {message.read ? (
                  <CheckCheck className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
        </div>

        {message.reactions && message.reactions.length > 0 && (
          <div className="absolute -bottom-2 right-2 bg-background border border-border rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
            {message.reactions.map((emoji, idx) => (
              <span key={idx} className="text-xs">
                {emoji}
              </span>
            ))}
          </div>
        )}

        <Popover open={showReactions} onOpenChange={setShowReactions}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" side="top">
            <div className="flex gap-1">
              {EMOJI_OPTIONS.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:scale-125 transition-transform"
                  onClick={() => {
                    onAddReaction(message.id, emoji);
                    setShowReactions(false);
                  }}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
