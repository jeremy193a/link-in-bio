import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseClient, generateId, getCurrentTimestamp } from '@/lib/db';
import { generateUniqueSlug } from '@/lib/slugify';
import { APIResponse, CreateProductRequest, Product } from '@/types';

export const runtime = 'edge';

// Helper to get database from Cloudflare context
function getDB(request: NextRequest): DatabaseClient {
  // @ts-expect-error - Cloudflare binding
  const db = request.nextUrl.searchParams.get('_worker_db') || globalThis.DB;
  return new DatabaseClient(db);
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as APIResponse,
        { status: 401 }
      );
    }

    const body: CreateProductRequest = await request.json();
    const {
      title,
      price,
      currency,
      description,
      highlights,
      contactMethod,
      contactValue,
      videoUrl,
      images,
      status = 'draft',
    } = body;

    // Validate required fields
    if (!title || !price || !highlights || highlights.length === 0 || !contactMethod || !contactValue) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        } as APIResponse,
        { status: 400 }
      );
    }

    if (images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one image is required' } as APIResponse,
        { status: 400 }
      );
    }

    // Get database (this will work in Cloudflare Pages)
    // For local dev, you'll need to use wrangler
    const db = getDB(request);

    // Generate unique slug
    const slug = await generateUniqueSlug(title, userId, db);

    // Generate IDs
    const productId = generateId();
    const timestamp = getCurrentTimestamp();

    // Prepare database operations
    const statements = [];

    // 1. Insert product
    statements.push(
      db.prepare(
        `INSERT INTO products (
          id, user_id, slug, title, price, currency, description,
          contact_method, contact_value, video_url, status,
          view_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
      ).bind(
        productId,
        userId,
        slug,
        title,
        price,
        currency || 'VNĐ',
        description || null,
        contactMethod,
        contactValue,
        videoUrl || null,
        status,
        timestamp,
        timestamp
      )
    );

    // 2. Insert highlights
    highlights.forEach((text, index) => {
      if (text.trim()) {
        const highlightId = generateId();
        statements.push(
          db.prepare(
            `INSERT INTO product_highlights (id, product_id, text, display_order)
             VALUES (?, ?, ?, ?)`
          ).bind(highlightId, productId, text.trim(), index)
        );
      }
    });

    // 3. Insert images
    images.forEach((image, index) => {
      const imageId = generateId();
      statements.push(
        db.prepare(
          `INSERT INTO product_images (id, product_id, r2_key, cdn_url, display_order, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(imageId, productId, image.r2Key, image.cdnUrl, index, timestamp)
      );
    });

    // Execute all statements in a batch transaction
    await db.batch(statements);

    // Return created product
    const product: Product = {
      id: productId,
      userId,
      slug,
      title,
      price,
      currency: currency || 'VNĐ',
      description: description || null,
      contactMethod,
      contactValue,
      videoUrl: videoUrl || null,
      status,
      viewCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return NextResponse.json({
      success: true,
      data: product,
    } as APIResponse<Product>);
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create product',
      } as APIResponse,
      { status: 500 }
    );
  }
}
