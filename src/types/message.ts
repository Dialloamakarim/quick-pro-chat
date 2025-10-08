export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
  reactions?: string[];
  imageUrl?: string;
  audioUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  fileName?: string;
  hidden?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  phoneNumber?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

export interface Group {
  id: string;
  name: string;
  avatar: string;
  members: string[]; // Contact IDs
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

export type Conversation = Contact | Group;

export function isGroup(conversation: Conversation): conversation is Group {
  return 'members' in conversation;
}
