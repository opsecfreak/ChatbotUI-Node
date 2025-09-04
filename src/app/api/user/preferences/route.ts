import { NextRequest, NextResponse } from 'next/server';

// Example API route for user preferences
export async function GET(request: NextRequest) {
  // Get user ID from search params or headers in a real application
  const userId = request.nextUrl.searchParams.get('userId') || 'anonymous';
  
  console.log('User preferences requested for:', {
    userId,
    timestamp: new Date().toISOString()
  });
  
  // In a real application, you would fetch this from a database
  // For now, return mock data
  const mockPreferences = {
    theme: 'light',
    fontSize: 'medium',
    notifications: true,
    language: 'en',
    lastUpdated: new Date().toISOString()
  };
  
  return NextResponse.json(mockPreferences, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const { userId, preferences } = await request.json();
    
    console.log('User preferences update:', {
      userId,
      preferences,
      timestamp: new Date().toISOString()
    });
    
    // Basic validation
    if (!userId || !preferences || typeof preferences !== 'object') {
      console.error('Validation error: userId and preferences object are required');
      return NextResponse.json(
        { error: 'userId and preferences object are required' },
        { status: 400 }
      );
    }
    
    // In a real application, you would update this in a database
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json({ 
      success: true,
      message: 'Preferences updated successfully',
      updatedAt: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
