import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { getOpenAIClient, createAgentMessages, defaultChatConfig } from '../../../../utils/openaiUtils';

/**
 * Agent Chat API
 * 
 * This endpoint handles communication with specialized OpenAI agents.
 * It processes user messages and returns AI-generated responses with
 * appropriate context based on the selected agent type.
 * 
 * OPTIMIZATION OPPORTUNITIES:
 * - Implement streaming responses for faster first response
 * - Add caching for similar queries to reduce API costs
 * - Implement rate limiting per user to prevent abuse
 * - Add request logging and analytics
 * 
 * SECURITY CONSIDERATIONS:
 * - Authentication is required for all requests
 * - API keys are kept server-side only
 * - Input validation prevents injection attacks
 * - Error handling avoids leaking sensitive information
 */

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
    
    // Parse request body
    const { messages, agentType = 'general' } = await request.json();
    
    // Basic validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Valid messages array is required' },
        { status: 400 }
      );
    }

    // Get user info for logging and potential personalization
    const userInfo = {
      id: session.user?.id || 'unknown',
      name: session.user?.name || 'unknown',
      username: session.user?.username || 'unknown',
      provider: session.user?.provider || 'unknown',
    };
    
    // Log the incoming request
    console.log('Agent API request:', {
      user: userInfo,
      agentType,
      messageCount: messages.length,
      timestamp: new Date().toISOString(),
    });
    
    // Format messages for OpenAI API
    const formattedMessages = createAgentMessages(messages, agentType);
    
    try {
      // Get OpenAI client
      const openai = getOpenAIClient();
      
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        ...defaultChatConfig,
        messages: formattedMessages,
      });
      
      // Extract the assistant's reply
      const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      
      // Log success
      console.log('OpenAI API response received successfully');
      
      // Return the response
      return NextResponse.json({ 
        message: reply,
        usage: completion.usage,
      }, { status: 200 });
      
    } catch (apiError: any) {
      console.error('OpenAI API error:', apiError);
      
      // Handle different types of API errors
      if (apiError.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      if (apiError.status === 400) {
        return NextResponse.json(
          { error: 'Invalid request to AI service.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Error communicating with AI service.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Agent API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
