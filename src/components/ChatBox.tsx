"use client";

import React, { useState } from 'react';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';
import { useChat } from '../hooks/useChat';
import { submitFeedback } from '../utils/apiUtils';

export default function ChatBox() {
  const { messages, isLoading, error, sendMessage } = useChat();
  const [showFeedback, setShowFeedback] = useState(false);
  
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
    <div className="flex flex-col h-full max-h-[calc(100vh-2rem)] bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Chat Assistant</h1>
        <div className="flex space-x-2">
          {messages.length > 1 && (
            <button 
              onClick={() => setShowFeedback(!showFeedback)}
              className="text-sm px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Feedback
            </button>
          )}
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
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/30 border-t border-red-200 dark:border-red-900">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
