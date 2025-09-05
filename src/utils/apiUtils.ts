"use client";

/**
 * API utility functions for making requests to the server
 */

/**
 * Send a message to the chat API
 * @param message - The user's message
 * @param messages - The conversation history
 * @param agentType - The type of agent to use (optional)
 * @returns The API response
 */
export async function sendChatMessage(message: string, messages: any[], agentType?: string) {
  try {
    const controller = new AbortController();
    // Set a timeout to prevent hanging requests
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
    
    // If agentType is provided, use the agent-specific API endpoint
    const endpoint = agentType ? '/api/agents/chat' : '/api/chat';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, messages, agentType }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || `Server error: ${response.status}`;
      throw new Error(`${errorMessage} (${response.status})`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('API call failed:', error);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. The server took too long to respond.');
    }
    throw error;
  }
}

/**
 * Save chat history to the server
 * @param userId - The user's ID
 * @param messages - The messages to save
 */
export async function saveChatHistory(userId: string, messages: any[]) {
  try {
    const response = await fetch('/api/user/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, messages }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to save chat history:', error);
    throw error;
  }
}

/**
 * Submit user feedback
 * @param feedback - The feedback text
 * @param rating - Numeric rating (e.g., 1-5)
 */
export async function submitFeedback(feedback: string, rating: number) {
  try {
    const response = await fetch('/api/user/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedback, rating }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    throw error;
  }
}

/**
 * Get user preferences
 * @param userId - The user's ID
 */
export async function getUserPreferences(userId: string) {
  try {
    const response = await fetch(`/api/user/preferences?userId=${userId}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get user preferences:', error);
    throw error;
  }
}

/**
 * Update user preferences
 * @param userId - The user's ID
 * @param preferences - The preferences object
 */
export async function updateUserPreferences(userId: string, preferences: Record<string, any>) {
  try {
    const response = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, preferences }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to update preferences:', error);
    throw error;
  }
}

/**
 * Fetch available agent types
 * @returns List of available agent types
 */
export async function fetchAgentTypes() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout
    
    const response = await fetch('/api/agents/types', {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Failed to fetch agent types:', error);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out while fetching agent types.');
    }
    throw error;
  }
}
