import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';

// Define available agent types and their descriptions
const agentTypes = {
  general: {
    id: 'general',
    name: 'General Assistant',
    description: 'A helpful assistant for general information and conversation',
    icon: '🤖',
  },
  coding: {
    id: 'coding',
    name: 'Code Assistant',
    description: 'Helps with programming questions, code examples, and debugging',
    icon: '💻',
  },
  creative: {
    id: 'creative',
    name: 'Creative Assistant',
    description: 'Assists with creative writing, ideas, and content creation',
    icon: '🎨',
  },
  academic: {
    id: 'academic',
    name: 'Academic Assistant',
    description: 'Provides scholarly information and helps with research',
    icon: '📚',
  },
};

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Return the available agent types
    return NextResponse.json({ 
      agents: Object.values(agentTypes),
      default: 'general',
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error retrieving agent types:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve agent types' },
      { status: 500 }
    );
  }
}
