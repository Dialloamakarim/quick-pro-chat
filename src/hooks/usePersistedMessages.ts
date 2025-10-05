import { useState, useEffect } from 'react';
import { Message } from '@/types/message';
import { useLocalStorage } from './useLocalStorage';

export function usePersistedMessages(initialMessages: Record<string, Message[]>) {
  const [messages, setMessages] = useLocalStorage<Record<string, Message[]>>(
    'quickmessage-conversations',
    initialMessages
  );

  // Sync with mock data on first load if localStorage is empty
  useEffect(() => {
    const storedData = window.localStorage.getItem('quickmessage-conversations');
    if (!storedData) {
      setMessages(initialMessages);
    }
  }, []);

  return [messages, setMessages] as const;
}
