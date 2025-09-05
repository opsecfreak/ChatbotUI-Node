import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// Initialize the OpenAI client with API key from environment variables
export const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }
  
  return new OpenAI({
    apiKey,
    organization: process.env.OPENAI_ORGANIZATION, // Optional
  });
};

// Default configuration for chat completions
export const defaultChatConfig = {
  model: process.env.OPENAI_MODEL || "gpt-4o", // Default model
  temperature: 0.7,
  max_tokens: 1000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

// Function to validate and format messages for OpenAI
export const formatMessagesForOpenAI = (messages: Array<{role: string; content: string}>): ChatCompletionMessageParam[] => {
  // Validate the message format
  return messages.map(message => {
    // Make sure role is one of: 'system', 'user', 'assistant'
    const role = ['system', 'user', 'assistant'].includes(message.role) 
      ? message.role as "system" | "user" | "assistant"
      : message.role === 'bot' ? 'assistant' as const : 'user' as const;
      
    return {
      role,
      content: message.content,
    };
  });
};

// Get system prompt based on agent type
export const getSystemPrompt = (agentType: string) => {
  const systemPrompts: Record<string, string> = {
    general: "You are a helpful AI assistant. Provide clear, concise, and accurate responses.",
    coding: "You are a coding assistant. Help with programming questions, provide code examples, and debug issues.",
    creative: "You are a creative writing assistant. Help with storytelling, creative ideas, and writing content.",
    academic: "You are an academic assistant. Provide scholarly information, help with research, and explain complex topics.",
  };
  
  return systemPrompts[agentType] || systemPrompts.general;
};

// Function to create agent prompts
export const createAgentMessages = (messages: any[], agentType: string): ChatCompletionMessageParam[] => {
  const systemPrompt = getSystemPrompt(agentType);
  
  // Start with system message
  const systemMessage: ChatCompletionMessageParam = { 
    role: "system", 
    content: systemPrompt 
  };
  
  // Format user and assistant messages
  const formattedMessages = formatMessagesForOpenAI(messages);
  
  // Return the combined messages
  return [systemMessage, ...formattedMessages];
};
