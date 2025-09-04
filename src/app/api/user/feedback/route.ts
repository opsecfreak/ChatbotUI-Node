import { NextRequest, NextResponse } from 'next/server';

// Example API route for user feedback
export async function POST(request: NextRequest) {
  try {
    const { feedback, rating } = await request.json();
    
    console.log('User feedback received:', {
      feedback,
      rating,
      timestamp: new Date().toISOString()
    });
    
    // Basic validation
    if (!feedback || !rating) {
      console.error('Validation error: Feedback and rating are required');
      return NextResponse.json(
        { error: 'Feedback and rating are required' },
        { status: 400 }
      );
    }
    
    // In a real application, you would store this in a database
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({ 
      success: true,
      message: 'Feedback received successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
}
