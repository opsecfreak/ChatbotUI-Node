"use client";

import React, { useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import { Message } from '../types';
import { scrollToBottom, isNearBottom } from '../utils/scrollUtils';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatContainer({ messages, isLoading }: ChatContainerProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const wasNearBottomRef = useRef(true);

  // Handle automatic scrolling
  useEffect(() => {
    const container = chatContainerRef.current;
    
    // Check if already near bottom before new messages are added
    wasNearBottomRef.current = isNearBottom(container);
    
    // If we were already near the bottom, scroll to the bottom again
    if (wasNearBottomRef.current) {
      scrollToBottom(container);
    }
  }, [messages]);

  // Loading indicator
  const LoadingIndicator = () => (
    <div className="flex w-full justify-start mb-4 fade-in">
      <div className="bg-[var(--assistant-message-bg)] rounded-2xl rounded-tl-none px-4 py-3">
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide"
    >
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
      
      {isLoading && <LoadingIndicator />}
      
      {/* Auto-scroll anchor */}
      <div id="chat-anchor"></div>
    </div>
  );
}
