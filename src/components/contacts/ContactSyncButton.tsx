import { Button } from "@/components/ui/button";
import { Users, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getPhoneContacts, PhoneContact } from "@/utils/contactsManager";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { makePhoneCall } from "@/utils/contactsManager";

interface ContactSyncButtonProps {
  onContactsImported?: (contacts: PhoneContact[]) => void;
}

export const ContactSyncButton = ({ onContactsImported }: ContactSyncButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneContacts, setPhoneContacts] = useState<PhoneContact[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSyncContacts = async () => {
    setIsLoading(true);
    try {
      const contacts = await getPhoneContacts();
      setPhoneContacts(contacts);
      onContactsImported?.(contacts);
      
      toast({
        title: "Contacts synchronisés",
        description: `${contacts.length} contacts importés avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'accéder aux contacts. Vérifiez les permissions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = (phoneNumber: string, contactName: string) => {
    makePhoneCall(phoneNumber);
    toast({
      title: "Appel en cours",
      description: `Appel vers ${contactName}...`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleSyncContacts}
        >
          <Users className="h-4 w-4" />
          Synchroniser contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contacts du téléphone</DialogTitle>
          <DialogDescription>
            {phoneContacts.length > 0
              ? `${phoneContacts.length} contacts disponibles`
              : "Aucun contact synchronisé"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncContacts}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Synchronisation..." : "Rafraîchir"}
          </Button>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {phoneContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>
                      {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{contact.name}</p>
                    {contact.phoneNumbers.length > 0 && (
                      <p className="text-xs text-muted-foreground truncate">
                        {contact.phoneNumbers[0]}
                      </p>
                    )}
                  </div>
                </div>
                {contact.phoneNumbers.length > 0 && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleCall(contact.phoneNumbers[0], contact.name)}
                    className="shrink-0 ml-2"
                  >
                    Appeler
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
