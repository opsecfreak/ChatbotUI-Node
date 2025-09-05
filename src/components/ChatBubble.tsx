"use client";

import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={`flex w-full mb-4 fade-in ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div 
        className={`max-w-[85%] px-3 py-2 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-[var(--user-message-bg)] text-white rounded-tr-none' 
            : message.content.includes('⚠️') 
              ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 rounded-tl-none' 
              : 'bg-[var(--assistant-message-bg)] rounded-tl-none'
        }`}
      >
        <p className={`text-xs sm:text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed ${
          message.content.includes('⚠️') ? 'text-red-600 dark:text-red-400' : ''
        }`}>
          {message.content}
        </p>
        <div 
          className={`text-[10px] mt-1 opacity-70 ${
            isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
}
