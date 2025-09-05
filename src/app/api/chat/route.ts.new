import { NextRequest, NextResponse } from 'next/server';
import { Message } from '../../../types';
import { auth } from '../../../auth';
import { getOpenAIClient, formatMessagesForOpenAI, defaultChatConfig } from '../../../utils/openaiUtils';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    const { message, messages } = await request.json();
    
    // Extract user details from session for logging and potential personalization
    const userDetails = {
      id: session.user?.id,
      name: session.user?.name,
      email: session.user?.email,
      username: session.user?.username,
      provider: session.user?.provider,
      role: session.user?.role
    };
    
    // Log the incoming request data with user details
    console.log('Chat API received:', {
      user: userDetails,
      message,
      messageCount: messages?.length || 0,
      timestamp: new Date().toISOString()
    });
    
    // Basic validation
    if (!message || typeof message !== 'string') {
      console.error('Validation error: Message is required');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    try {
      // Process using OpenAI if API key is available, otherwise use fallback
      if (process.env.OPENAI_API_KEY) {
        const response = await processWithOpenAI(message, messages || [], userDetails);
        console.log('OpenAI response sent');
        return NextResponse.json({ message: response }, { status: 200 });
      } else {
        // Fallback to basic response if OpenAI API key is not configured
        console.log('OpenAI API key not configured, using fallback response');
        const fallbackResponse = await fallbackProcessUserMessage(message);
        return NextResponse.json({ message: fallbackResponse }, { status: 200 });
      }
    } catch (processingError) {
      console.error('Error processing message:', processingError);
      return NextResponse.json(
        { error: 'Error processing your message', details: (processingError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

/**
 * Process message with OpenAI API
 */
async function processWithOpenAI(message: string, previousMessages: Message[], userInfo: any): Promise<string> {
  try {
    // Get OpenAI client
    const openai = getOpenAIClient();
    
    // Format message history for OpenAI
    const formattedMessages = formatMessagesForOpenAI([
      // System message
      { 
        role: "system", 
        content: `You are a helpful assistant engaging in a conversation. Be concise, helpful, and friendly.
                  Current date: ${new Date().toISOString().split('T')[0]}`
      },
      // Previous messages if available (limited to last 10 for context)
      ...previousMessages.slice(-10).map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      // Current message
      { role: "user", content: message }
    ]);
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      ...defaultChatConfig,
      messages: formattedMessages,
    });
    
    return completion.choices[0]?.message?.content || 
           "I'm sorry, I couldn't generate a proper response at this time.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to communicate with AI service");
  }
}

/**
 * Fallback process function for when OpenAI is not configured
 */
async function fallbackProcessUserMessage(message: string): Promise<string> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simple keyword-based responses for demo
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello there! How can I assist you today?';
  }
  
  if (lowerMessage.includes('help')) {
    return 'I\'m here to help! You can ask me questions and I\'ll do my best to assist you.';
  }
  
  if (lowerMessage.includes('time') || lowerMessage.includes('date')) {
    return `The current date and time is ${new Date().toLocaleString()}`;
  }
  
  // Default response
  return `You said: "${message}"\n\nThis is a fallback response because OpenAI API is not configured. Add your OpenAI API key to use the AI service.`;
}
