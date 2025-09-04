import { NextRequest, NextResponse } from 'next/server';

// Example API route for saving chat history
export async function POST(request: NextRequest) {
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
    
    // Simulate processing time
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
