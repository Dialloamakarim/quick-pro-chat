import { MessageSquare, Phone, Search, Zap } from "lucide-react";

export const WelcomeScreen = () => {
  return (
    <div className="flex items-center justify-center h-full bg-chat-bg">
      <div className="text-center max-w-md px-6">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bienvenue sur QuickMessage
          </h2>
          <p className="text-muted-foreground mb-8">
            Messagerie professionnelle rapide et intuitive
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 text-left">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Messages instantanés</h3>
              <p className="text-xs text-muted-foreground">
                Envoyez et recevez des messages en temps réel
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Appels intégrés</h3>
              <p className="text-xs text-muted-foreground">
                Appelez directement depuis l'application mobile
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Recherche rapide</h3>
              <p className="text-xs text-muted-foreground">
                Trouvez instantanément vos conversations
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          👈 Sélectionnez une conversation pour commencer
        </p>
      </div>
    </div>
  );
};
