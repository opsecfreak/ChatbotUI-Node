import { useState, useCallback, useEffect } from 'react';
import { Message } from '../types';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with a welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: 'Hello! How can I assist you today?',
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Generate a unique ID for the new message
    const userMessageId = `user-${Date.now()}`;
    
    // Create a new user message
    const userMessage: Message = {
      id: userMessageId,
      content,
      role: 'user',
      timestamp: new Date(),
    };
    
    // Add the user message to the chat
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Start loading
      setIsLoading(true);
      setError(null);
      
      // Send the message to the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, messages }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Create a new assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      // Add the assistant message to the chat
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}
