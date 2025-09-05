"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Message } from '../types';
import { sendChatMessage, saveChatHistory, fetchAgentTypes } from '../utils/apiUtils';

export interface AgentType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<string>('general');
  const [availableAgents, setAvailableAgents] = useState<AgentType[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const { data: session } = useSession();

  // Initialize with a welcome message
  // Get welcome message based on agent type
  const getWelcomeMessage = useCallback((agentId: string) => {
    switch (agentId) {
      case 'coding':
        return "Hello! I'm your coding assistant. What programming challenge can I help you with today?";
      case 'creative':
        return "Welcome! I'm your creative assistant. Looking for inspiration or help with creative content?";
      case 'academic':
        return "Greetings! I'm your academic assistant. How can I help with your research or studies today?";
      case 'general':
      default:
        return "Hello! How can I assist you today?";
    }
  }, []);

  // Initialize with a welcome message
  useEffect(() => {
    // Create a new welcome message for first load
    if (messages.length === 0) {
      const currentAgent = availableAgents.find(a => a.id === selectedAgent);
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        content: getWelcomeMessage(selectedAgent),
        role: 'assistant',
        timestamp: new Date(),
        metadata: {
          agentType: selectedAgent,
          agentName: currentAgent?.name || 'Assistant'
        }
      };
      
      setMessages([welcomeMessage]);
    }
  }, [messages.length, selectedAgent, getWelcomeMessage]);
  
  // Reset chat when agent type changes
  const previousAgentRef = useRef(selectedAgent);
  
  useEffect(() => {
    // Skip on first render
    if (previousAgentRef.current !== selectedAgent && messages.length > 0) {
      // Agent has changed, reset the chat
      const currentAgent = availableAgents.find(a => a.id === selectedAgent);
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        content: getWelcomeMessage(selectedAgent),
        role: 'assistant',
        timestamp: new Date(),
        metadata: {
          agentType: selectedAgent,
          agentName: currentAgent?.name || 'Assistant'
        }
      };
      
      setMessages([welcomeMessage]);
      setError(null);
    }
    
    previousAgentRef.current = selectedAgent;
  }, [selectedAgent, getWelcomeMessage]);
  
  // Load available agent types
  useEffect(() => {
    const loadAgentTypes = async () => {
      if (session?.user) {
        try {
          setLoadingAgents(true);
          const data = await fetchAgentTypes();
          setAvailableAgents(data.agents || []);
          if (data.default && !selectedAgent) {
            setSelectedAgent(data.default);
          }
        } catch (err) {
          console.error('Error loading agent types:', err);
          // Fallback to a default agent list if the API fails
          setAvailableAgents([
            { 
              id: 'general',
              name: 'General Assistant',
              description: 'A helpful assistant for general information',
              icon: '🤖'
            }
          ]);
        } finally {
          setLoadingAgents(false);
        }
      }
    };
    
    loadAgentTypes();
  }, [session?.user, selectedAgent]);

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
      
      // Send the message to the API using our utility function with selected agent
      const data = await sendChatMessage(content, messages, selectedAgent);
      
      // Create a new assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
        metadata: {
          agentType: selectedAgent,
          agentName: availableAgents.find(a => a.id === selectedAgent)?.name || 'Assistant'
        }
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
        metadata: {
          error: true,
          agentType: selectedAgent,
          agentName: 'Error'
        }
      };
      
      setMessages(prev => [...prev, errorNotification]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, retryCount, selectedAgent]);
  
  // Reset the chat with a fresh conversation
  const resetChat = useCallback(() => {
    const currentAgent = availableAgents.find(a => a.id === selectedAgent);
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      content: getWelcomeMessage(selectedAgent),
      role: 'assistant',
      timestamp: new Date(),
      metadata: {
        agentType: selectedAgent,
        agentName: currentAgent?.name || 'Assistant'
      }
    };
    
    setMessages([welcomeMessage]);
    setError(null);
    setRetryCount(prev => prev + 1); // Increment retry count to force useCallback recreation
  }, [selectedAgent, getWelcomeMessage]);
  
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
    selectedAgent,
    setSelectedAgent,
    availableAgents,
    loadingAgents,
  };
}
