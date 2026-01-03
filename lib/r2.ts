export interface UploadResult {
    r2Key: string;
    cdnUrl: string;
}

// Generate UUID using Web Crypto API (works in Edge Runtime)
function generateUUID(): string {
    return crypto.randomUUID();
}

export async function uploadImage(
    file: Buffer | Uint8Array,
    userId: string,
    productId: string
): Promise<UploadResult> {
    // Generate unique key
    const key = `${userId}/${productId}/${generateUUID()}.jpg`;

    // Get R2 bucket binding from env (Cloudflare Pages will bind this automatically)
    const R2 = (globalThis as any).R2;

    if (!R2) {
        throw new Error('R2 bucket not configured. Make sure to bind R2 in Cloudflare Pages settings.');
    }

    // Upload to R2 using Cloudflare's R2 API
    await R2.put(key, file, {
        httpMetadata: {
            contentType: 'image/jpeg',
        },
    });

    // Return CDN URL
    const cdnUrl = `${process.env.NEXT_PUBLIC_CDN_URL}/${key}`;

    return { r2Key: key, cdnUrl };
}

export async function deleteImage(r2Key: string): Promise<void> {
    const R2 = (globalThis as any).R2;

    if (!R2) {
        throw new Error('R2 bucket not configured');
    }

    await R2.delete(r2Key);
}
