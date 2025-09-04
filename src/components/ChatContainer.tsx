"use client";

import React, { useRef, useEffect, useCallback } from 'react';
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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom function that can be called from elsewhere
  const scrollToBottomHandler = useCallback(() => {
    scrollToBottom(chatContainerRef.current);
  }, []);
  
  // Scroll on resize for better responsiveness
  useEffect(() => {
    window.addEventListener('resize', scrollToBottomHandler);
    return () => window.removeEventListener('resize', scrollToBottomHandler);
  }, [scrollToBottomHandler]);

  // Handle automatic scrolling with messages change
  useEffect(() => {
    const container = chatContainerRef.current;
    
    // Check if already near bottom before new messages are added
    wasNearBottomRef.current = isNearBottom(container);
    
    // If we were already near the bottom, scroll to the bottom again
    if (wasNearBottomRef.current) {
      // Immediate scroll for better UX
      container?.scrollTo({ top: container.scrollHeight });
      // Then smooth scroll after a slight delay to ensure DOM is updated
      setTimeout(() => {
        scrollToBottom(container);
      }, 100);
    }
  }, [messages]);

  // Modern, more subtle typing indicator
  const LoadingIndicator = () => (
    <div className="flex w-full justify-start mb-4 fade-in">
      <div className="bg-[var(--assistant-message-bg)] rounded-2xl rounded-tl-none px-4 py-3">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
  
  // Set up intersection observer for auto-scrolling
  useEffect(() => {
    // Disconnect old observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create new observer for the last message
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && !entry.isIntersecting && messages.length > 0) {
          // Show a "scroll to bottom" button or auto-scroll
          wasNearBottomRef.current = false;
        }
      },
      { root: chatContainerRef.current, threshold: 0.1 }
    );
    
    // Observe the last message if it exists
    if (lastMessageRef.current) {
      observerRef.current.observe(lastMessageRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide h-full max-h-[calc(100vh-180px)]"
    >
      {messages.map((message, index) => (
        <div key={message.id} ref={index === messages.length - 1 ? lastMessageRef : undefined}>
          <ChatBubble message={message} />
        </div>
      ))}
      
      {isLoading && <LoadingIndicator />}
      
      {/* Auto-scroll anchor */}
      <div id="chat-anchor" className="h-1"></div>
      
      {/* Manual scroll button (shown when auto-scroll is disabled) */}
      {!wasNearBottomRef.current && messages.length > 2 && (
        <button
          onClick={scrollToBottomHandler}
          className="fixed bottom-24 right-8 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all opacity-80 hover:opacity-100"
          aria-label="Scroll to bottom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}
