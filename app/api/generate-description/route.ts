import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateProductDescription } from '@/lib/ai';
import { APIResponse, GenerateDescriptionRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as APIResponse,
        { status: 401 }
      );
    }

    const body: GenerateDescriptionRequest = await request.json();
    const { title, price, currency, highlights } = body;

    // Validate input
    if (!title || !price || !highlights || highlights.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, price, and highlights are required',
        } as APIResponse,
        { status: 400 }
      );
    }

    // Generate description using AI
    const description = await generateProductDescription({
      title,
      price,
      currency,
      highlights,
    });

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate description' } as APIResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { description },
    } as APIResponse<{ description: string }>);
  } catch (error) {
    console.error('AI description generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate description',
      } as APIResponse,
      { status: 500 }
    );
  }
}
