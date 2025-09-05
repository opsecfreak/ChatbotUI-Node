"use client";

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Message } from '../types';
import { sendChatMessage, saveChatHistory } from '../utils/apiUtils';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
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
      let errorMessage = 'There was an error processing your request. Please try again.';
      
      if (err instanceof Error) {
        // Check for network/API errors
        if (err.message.includes('fetch') || err.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error. The service may be temporarily unavailable.';
        } else if (err.message.includes('timeout') || err.message.includes('TIMEOUT')) {
          errorMessage = 'Request timed out. Please try again later.';
        } else if (err.message.includes('401') || err.message.includes('unauthorized')) {
          errorMessage = 'Authentication error. Please sign in again.';
        }
      }
      
      setError(errorMessage);
      
      // Add error message to chat for better UX
      const errorNotification: Message = {
        id: `error-${Date.now()}`,
        content: `⚠️ ${errorMessage}`,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorNotification]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, retryCount]);
  
  // Reset the chat with a fresh conversation
  const resetChat = useCallback(() => {
    setMessages([{
      id: '1',
      content: 'Hello! How can I assist you today?',
      role: 'assistant',
      timestamp: new Date(),
    }]);
    setError(null);
    setRetryCount(prev => prev + 1); // Increment retry count to force useCallback recreation
  }, []);
  
  // Retry the last user message
  const retryLastMessage = useCallback(() => {
    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    
    if (lastUserMessage) {
      // Remove the error message and any assistant messages after the last user message
      const lastUserIndex = messages.findIndex(msg => msg.id === lastUserMessage.id);
      const cleanedMessages = messages.slice(0, lastUserIndex + 1);
      
      setMessages(cleanedMessages);
      setError(null);
      setRetryCount(prev => prev + 1); // Force recreation of the callback
      
      // Resend the last user message
      sendMessage(lastUserMessage.content);
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetChat,
    retryLastMessage,
  };
}
