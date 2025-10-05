import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Paperclip, Send, Smile, Image as ImageIcon, Mic, Square, MapPin } from "lucide-react";
import { useState, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { takePhoto, pickImageFromGallery, pickImageWeb } from "@/utils/cameraManager";
import { AudioRecorder } from "@/utils/audioRecorder";
import { getCurrentPosition } from "@/utils/locationManager";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageInputProps {
  onSend: (text: string, imageUrl?: string, audioUrl?: string, location?: { latitude: number; longitude: number }) => void;
}

export const MessageInput = ({ onSend }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const audioRecorderRef = useRef<AudioRecorder | null>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleTakePhoto = async () => {
    const imageUrl = await takePhoto();
    if (imageUrl) {
      onSend("📷 Photo", imageUrl);
      toast({
        title: "Photo envoyée",
        description: "Votre photo a été envoyée avec succès",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de prendre la photo",
        variant: "destructive",
      });
    }
  };

  const handlePickImage = async () => {
    let imageUrl: string | null = null;
    
    if (Capacitor.isNativePlatform()) {
      imageUrl = await pickImageFromGallery();
    } else {
      imageUrl = await pickImageWeb();
    }

    if (imageUrl) {
      onSend("🖼️ Image", imageUrl);
      toast({
        title: "Image envoyée",
        description: "Votre image a été envoyée avec succès",
      });
    }
  };

  const handleStartRecording = async () => {
    try {
      audioRecorderRef.current = new AudioRecorder();
      await audioRecorderRef.current.startRecording();
      setIsRecording(true);
      toast({
        title: "Enregistrement en cours",
        description: "Appuyez à nouveau pour arrêter",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = async () => {
    try {
      if (audioRecorderRef.current) {
        const audioUrl = await audioRecorderRef.current.stopRecording();
        setIsRecording(false);
        onSend("🎤 Message vocal", undefined, audioUrl);
        toast({
          title: "Message vocal envoyé",
          description: "Votre message vocal a été envoyé",
        });
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };

  const handleShareLocation = async () => {
    toast({
      title: "Localisation en cours...",
      description: "Récupération de votre position",
    });

    const position = await getCurrentPosition();
    
    if (position) {
      onSend("📍 Position partagée", undefined, undefined, position);
      toast({
        title: "Position partagée",
        description: "Votre position a été envoyée",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer votre position",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-background border-t border-border safe-bottom">
      <div className="flex items-end gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0 touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <Smile className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0 touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {Capacitor.isNativePlatform() && (
              <DropdownMenuItem onClick={handleTakePhoto}>
                <Camera className="h-4 w-4 mr-2" />
                Prendre une photo
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handlePickImage}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Choisir une image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareLocation}>
              <MapPin className="h-4 w-4 mr-2" />
              Partager ma position
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Écrire un message..."
          className="flex-1"
          disabled={isRecording}
        />
        
        {isRecording ? (
          <Button
            onClick={handleStopRecording}
            size="icon"
            className="shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95 touch-manipulation transition-transform animate-pulse"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Square className="h-5 w-5" />
          </Button>
        ) : message.trim() ? (
          <Button
            onClick={handleSend}
            size="icon"
            className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 touch-manipulation transition-transform"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Send className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            onClick={handleStartRecording}
            size="icon"
            variant="ghost"
            className="shrink-0 touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
