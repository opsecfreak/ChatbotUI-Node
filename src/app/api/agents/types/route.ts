import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';

/**
 * Agent Types API
 * 
 * This endpoint provides information about available chat agent types.
 * Each agent has a unique ID, display name, description, and visual icon.
 * 
 * CUSTOMIZATION GUIDE:
 * To add a new agent type:
 * 1. Add a new entry to the agentTypes object below
 * 2. Provide id, name, description, and icon
 * 3. Update the corresponding prompt templates in openaiUtils.ts
 * 
 * SECURITY NOTE:
 * This endpoint requires authentication to prevent unauthorized access
 * to agent capabilities and customizations.
 */

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
