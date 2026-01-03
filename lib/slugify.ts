import { DatabaseClient } from './db';

/**
 * Vietnamese character mapping for slug generation
 */
const vietnameseMap: Record<string, string> = {
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'đ': 'd',
  'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
};

/**
 * Convert Vietnamese text to URL-friendly slug
 * Example: "Áo Thun Cao Cấp 2024" → "ao-thun-cao-cap-2024"
 */
export function slugify(text: string): string {
  let slug = text.toLowerCase();

  // Replace Vietnamese characters
  for (const [vietnamese, latin] of Object.entries(vietnameseMap)) {
    slug = slug.replace(new RegExp(vietnamese, 'g'), latin);
  }

  // Replace spaces and special characters with hyphens
  slug = slug
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '')       // Remove leading/trailing hyphens
    .replace(/-{2,}/g, '-');       // Replace multiple hyphens with single

  return slug;
}

/**
 * Generate a unique slug for a product
 * If slug already exists, append a number (e.g., "ao-thun-2", "ao-thun-3")
 */
export async function generateUniqueSlug(
  title: string,
  userId: string,
  db: DatabaseClient
): Promise<string> {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  // Keep checking until we find a unique slug
  while (await checkSlugExists(slug, userId, db)) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

/**
 * Check if a slug already exists for a user
 */
async function checkSlugExists(
  slug: string,
  userId: string,
  db: DatabaseClient
): Promise<boolean> {
  const result = await db.queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM products WHERE user_id = ? AND slug = ?',
    [userId, slug]
  );

  return (result?.count ?? 0) > 0;
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  // Only lowercase letters, numbers, and hyphens
  // Cannot start or end with hyphen
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}
