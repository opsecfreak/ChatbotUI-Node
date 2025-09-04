import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';

// Example API route for saving chat history
export async function POST(request: NextRequest) {
  // Get the user session to verify authentication
  const session = await auth();
  
  // Ensure the user is authenticated
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  try {
    const { userId, messages } = await request.json();
    
    console.log('Save chat history request:', {
      userId,
      messageCount: messages?.length || 0,
      timestamp: new Date().toISOString()
    });
    
    // Basic validation
    if (!userId || !messages || !Array.isArray(messages)) {
      console.error('Validation error: userId and messages array are required');
      return NextResponse.json(
        { error: 'userId and messages array are required' },
        { status: 400 }
      );
    }
    
    // In a real application, you would store this in a database
    // Here we could add user-specific info from the session
    const userDetails = {
      userId,
      provider: session.user.provider,
      username: session.user.username || session.user.name,
      messageCount: messages.length,
    };
    
    console.log('User details for history:', userDetails);
    
    // Simulate database processing time
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return NextResponse.json({ 
      success: true,
      message: 'Chat history saved successfully',
      savedAt: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error('Error saving chat history:', error);
    return NextResponse.json(
      { error: 'Failed to save chat history' },
      { status: 500 }
    );
  }
}
