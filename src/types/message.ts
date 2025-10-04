export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
  reactions?: string[];
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}
