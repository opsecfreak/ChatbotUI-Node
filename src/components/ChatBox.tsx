import React from 'react';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';
import { useChat } from '../hooks/useChat';

export default function ChatBox() {
  const { messages, isLoading, error, sendMessage } = useChat();

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-2rem)] bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold text-center">Chat Assistant</h1>
      </div>
      
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
