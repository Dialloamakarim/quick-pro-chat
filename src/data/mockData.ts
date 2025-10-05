import { Contact, Message, Group } from "@/types/message";

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sophie Martin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    online: true,
    phoneNumber: "+33612345678",
    lastMessage: "Parfait, on se retrouve demain à 14h",
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 0,
  },
  {
    id: "2",
    name: "Thomas Dubois",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
    online: true,
    phoneNumber: "+33623456789",
    lastMessage: "J'ai envoyé le document",
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
    unreadCount: 2,
  },
  {
    id: "3",
    name: "Julie Lefebvre",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julie",
    online: false,
    phoneNumber: "+33634567890",
    lastMessage: "Merci pour ton aide!",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
  },
  {
    id: "4",
    name: "Marc Rousseau",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc",
    online: true,
    phoneNumber: "+33645678901",
    lastMessage: "On peut planifier une réunion?",
    lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    unreadCount: 1,
  },
  {
    id: "5",
    name: "Emma Bernard",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    online: false,
    phoneNumber: "+33656789012",
    lastMessage: "Super idée!",
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
  },
];

export const mockGroups: Group[] = [
  {
    id: "g1",
    name: "Équipe Projet",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=EP",
    members: ["1", "2", "4"],
    lastMessage: "On se retrouve demain à 10h",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 3,
  },
  {
    id: "g2",
    name: "Famille",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=FA",
    members: ["3", "5"],
    lastMessage: "Bon anniversaire !",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
  },
];

export const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      senderId: "1",
      text: "Salut! Comment ça va?",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
    },
    {
      id: "m2",
      senderId: "me",
      text: "Très bien merci! Et toi?",
      timestamp: new Date(Date.now() - 55 * 60 * 1000),
      read: true,
    },
    {
      id: "m3",
      senderId: "1",
      text: "Super! On se voit demain pour la réunion?",
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
      read: true,
    },
    {
      id: "m4",
      senderId: "me",
      text: "Oui bien sûr, à quelle heure?",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: true,
    },
    {
      id: "m5",
      senderId: "1",
      text: "Parfait, on se retrouve demain à 14h",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: true,
    },
  ],
  "2": [
    {
      id: "m6",
      senderId: "2",
      text: "Voici les derniers chiffres du projet",
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      read: false,
    },
    {
      id: "m7",
      senderId: "2",
      text: "J'ai envoyé le document",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
    },
  ],
  "g1": [
    {
      id: "mg1",
      senderId: "2",
      text: "Bonjour à tous!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "mg2",
      senderId: "1",
      text: "Salut! Comment avance le projet?",
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      read: true,
    },
    {
      id: "mg3",
      senderId: "4",
      text: "On se retrouve demain à 10h",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
  ],
  "g2": [
    {
      id: "mg4",
      senderId: "3",
      text: "Bon anniversaire !",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
  ],
};
