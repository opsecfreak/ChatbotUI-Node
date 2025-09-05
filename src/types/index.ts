export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  agent?: string; // The type of agent that generated this message
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
