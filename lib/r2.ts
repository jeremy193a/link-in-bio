import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

// R2 is S3-compatible
const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

export interface UploadResult {
    r2Key: string;
    cdnUrl: string;
}

export async function uploadImage(
    file: Buffer,
    userId: string,
    productId: string
): Promise<UploadResult> {
    // Optimize image with sharp
    const optimized = await sharp(file)
        .resize(1920, 1920, {
            fit: 'inside',
            withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();

    // Generate unique key
    const key = `${userId}/${productId}/${randomUUID()}.jpg`;

    // Upload to R2
    await r2Client.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            Body: optimized,
            ContentType: 'image/jpeg',
        })
    );

    // Return CDN URL
    const cdnUrl = `${process.env.NEXT_PUBLIC_CDN_URL}/${key}`;

    return { r2Key: key, cdnUrl };
}

export async function deleteImage(r2Key: string): Promise<void> {
    await r2Client.send(
        new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: r2Key,
        })
    );
}
