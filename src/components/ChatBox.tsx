"use client";

/**
 * ChatBox Component - Main Chat Interface
 * 
 * This is the primary chat interface component that combines all chat-related elements:
 * - Header with user info and agent selection
 * - Message container
 * - Input area
 * - Error handling UI
 * - Feedback mechanism
 * 
 * CUSTOMIZATION POINTS:
 * - Add custom branding elements to the header
 * - Implement more advanced feedback collection
 * - Add additional chat controls or settings
 * - Customize error display and recovery options
 * - Add chat export/import functionality
 */

import React, { useState } from 'react';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';
import { useChat } from '../hooks/useChat';
import { submitFeedback } from '../utils/apiUtils';
import LogoutButton from './auth/LogoutButton';
import { useSession } from 'next-auth/react';
import AgentSelector from './AgentSelector';

export default function ChatBox() {
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    resetChat, 
    retryLastMessage,
    selectedAgent,
    setSelectedAgent,
    availableAgents,
    loadingAgents
  } = useChat();
  const [showFeedback, setShowFeedback] = useState(false);
  const { data: session } = useSession();
  
  const handleFeedback = async (rating: number) => {
    try {
      await submitFeedback(`Rating for conversation`, rating);
      setShowFeedback(false);
      // You could show a thank you message here
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-1rem)] bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-medium">Chat Assistant</h1>
          {availableAgents.length > 0 && (
            <AgentSelector 
              agents={availableAgents} 
              selectedAgent={selectedAgent} 
              onSelectAgent={setSelectedAgent} 
              isLoading={isLoading || loadingAgents}
            />
          )}
        </div>
        <div className="flex space-x-3 items-center">
          {session?.user && (
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              {session.user.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || "User"} 
                  className="w-5 h-5 rounded-full mr-1" 
                />
              )}
              <span className="max-w-[100px] truncate">
                {session.user.username || session.user.name}
              </span>
              {session.user.provider === "github" && (
                <svg className="w-3 h-3 ml-1 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              )}
            </div>
          )}
          {messages.length > 1 && (
            <button 
              onClick={() => setShowFeedback(!showFeedback)}
              className="text-xs px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Feedback
            </button>
          )}
          <LogoutButton />
        </div>
      </div>
      
      {showFeedback && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 text-center">
          <p className="text-sm mb-2">How helpful was this conversation?</p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button 
                key={rating}
                onClick={() => handleFeedback(rating)}
                className="px-3 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <ChatContainer messages={messages} isLoading={isLoading} />
      
      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-900 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-red-600 dark:text-red-400 mb-2 sm:mb-0">{error}</p>
          <div className="flex space-x-2">
            <button 
              onClick={retryLastMessage}
              disabled={isLoading}
              className="text-xs px-3 py-1 rounded bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 transition"
            >
              Retry Message
            </button>
            <button 
              onClick={resetChat}
              disabled={isLoading}
              className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
            >
              Reset Chat
            </button>
          </div>
        </div>
      )}
      
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
