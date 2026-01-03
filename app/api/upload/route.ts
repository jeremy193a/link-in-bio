import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/r2';
import { APIResponse, UploadedImage } from '@/types';

export const runtime = 'edge';

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

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No images provided' } as APIResponse,
        { status: 400 }
      );
    }

    // Validate files
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `File type not allowed: ${file.type}. Only JPEG, PNG, and WebP are supported.`,
          } as APIResponse,
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `File too large: ${file.name}. Maximum size is 5MB.`,
          } as APIResponse,
          { status: 400 }
        );
      }
    }

    // Upload images to R2
    const uploadedImages: UploadedImage[] = [];
    const productId = formData.get('productId') as string || `temp-${Date.now()}`;

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadImage(buffer, userId, productId);
      uploadedImages.push(result);
    }

    return NextResponse.json({
      success: true,
      data: uploadedImages,
    } as APIResponse<UploadedImage[]>);
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload images',
      } as APIResponse,
      { status: 500 }
    );
  }
}
