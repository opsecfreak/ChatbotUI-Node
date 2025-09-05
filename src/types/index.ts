export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  agent?: string; // The type of agent that generated this message (deprecated, use metadata instead)
  metadata?: {
    agentType?: string;
    agentName?: string;
    error?: boolean;
    [key: string]: any; // Allow for future extensions
  };
};

export type AgentType = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type ChatState = {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentAgent?: string;
};
