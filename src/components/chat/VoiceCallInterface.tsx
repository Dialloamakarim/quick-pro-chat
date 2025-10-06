import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { Mic, MicOff, PhoneOff } from 'lucide-react';

interface VoiceCallInterfaceProps {
  open: boolean;
  onClose: () => void;
  contactName: string;
}

export const VoiceCallInterface = ({ open, onClose, contactName }: VoiceCallInterfaceProps) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (event: any) => {
    console.log('Received message:', event);
    
    if (event.type === 'response.audio.delta') {
      setIsSpeaking(true);
    } else if (event.type === 'response.audio.done') {
      setIsSpeaking(false);
    }
  };

  const startCall = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      chatRef.current = new RealtimeChat(handleMessage);
      await chatRef.current.init(supabaseUrl);
      setIsConnected(true);
      
      toast({
        title: "Appel connecté",
        description: `Appel vocal avec ${contactName}`,
      });
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de démarrer l'appel",
        variant: "destructive",
      });
    }
  };

  const endCall = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsSpeaking(false);
    onClose();
  };

  useEffect(() => {
    if (open && !isConnected) {
      startCall();
    }
    
    return () => {
      if (chatRef.current) {
        chatRef.current.disconnect();
      }
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Appel vocal avec {contactName}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-8 py-8">
          <div className="relative">
            <div className={`w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center ${isSpeaking ? 'animate-pulse' : ''}`}>
              <div className="w-24 h-24 rounded-full bg-primary/40 flex items-center justify-center">
                <Mic className="h-12 w-12 text-primary" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold">
              {isConnected ? 'Connecté' : 'Connexion...'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isSpeaking ? 'Parle...' : 'En attente'}
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            
            <Button
              variant="destructive"
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={endCall}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
