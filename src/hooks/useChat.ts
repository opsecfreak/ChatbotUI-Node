"use client";

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Message } from '../types';
import { sendChatMessage, saveChatHistory } from '../utils/apiUtils';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

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
      
      // Send the message to the API using our utility function
      const data = await sendChatMessage(content, messages);
      
      // Create a new assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      // Add the assistant message to the chat
      setMessages(prev => {
        const updatedMessages = [...prev, assistantMessage];
        
        // Save the chat history with the user's ID from the session
        // This would allow for user-specific chat history persistence
        if (session?.user?.id) {
          saveChatHistory(session.user.id, updatedMessages)
            .catch(err => console.error('Failed to save history:', err));
        } else {
          // For backwards compatibility or if user ID is not available
          saveChatHistory(session?.user?.email || 'anonymous-user', updatedMessages)
            .catch(err => console.error('Failed to save history:', err));
        }
          
        return updatedMessages;
      });
      
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
