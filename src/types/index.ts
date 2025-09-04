export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

export type ChatState = {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
};

export type User = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

export type Preferences = Record<string, unknown>;
