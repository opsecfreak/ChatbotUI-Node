"use client";

import React, { useState } from 'react';
import { AgentType } from '../hooks/useChat';

interface AgentSelectorProps {
  agents: AgentType[];
  selectedAgent: string;
  onSelectAgent: (agentId: string) => void;
  isLoading: boolean;
}

export default function AgentSelector({ 
  agents, 
  selectedAgent, 
  onSelectAgent, 
  isLoading 
}: AgentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find the currently selected agent
  const currentAgent = agents.find(agent => agent.id === selectedAgent) || agents[0] || {
    id: 'general',
    name: 'General Assistant',
    description: 'A helpful assistant for general information',
    icon: '🤖'
  };

  const handleSelectAgent = (agentId: string) => {
    onSelectAgent(agentId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`flex items-center space-x-1 px-2 py-1 text-sm rounded-md transition-colors
                   ${isOpen ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
      >
        <span className="mr-1" role="img" aria-label={currentAgent.name}>
          {currentAgent.icon}
        </span>
        <span className="max-w-[110px] truncate">{currentAgent.name}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className="absolute left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="agent-selector"
        >
          <div className="py-1">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleSelectAgent(agent.id)}
                className={`flex items-start space-x-2 px-4 py-2 text-sm w-full text-left
                           ${selectedAgent === agent.id 
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                role="menuitem"
              >
                <span className="text-xl mr-2" role="img" aria-label={agent.name}>
                  {agent.icon}
                </span>
                <div>
                  <div className="font-medium">{agent.name}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {agent.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
