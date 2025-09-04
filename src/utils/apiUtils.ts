"use client";

/**
 * API utility functions for making requests to the server
 */

import { Message, Preferences } from '../types';

/**
 * Send a message to the chat API
 * @param message - The user's message
 * @param messages - The conversation history
 * @returns The API response
 */
export async function sendChatMessage(message: string, messages: Message[]) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, messages }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

/**
 * Save chat history to the server
 * @param userId - The user's ID
 * @param messages - The messages to save
 */
export async function saveChatHistory(userId: string, messages: Message[]) {
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
export async function updateUserPreferences(userId: string, preferences: Preferences) {
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
