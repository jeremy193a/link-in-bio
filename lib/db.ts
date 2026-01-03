import { type D1Database, type D1PreparedStatement } from '@cloudflare/workers-types';

// Type for D1 query result
interface D1Result<T = unknown> {
    results: T[];
    success: boolean;
    meta: {
        duration: number;
        rows_read: number;
        rows_written: number;
    };
}

// Database client wrapper
export class DatabaseClient {
    constructor(private db: D1Database) { }

    async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
        const result = await this.db.prepare(sql).bind(...(params || [])).all();
        return result.results as T[];
    }

    async queryOne<T>(sql: string, params?: unknown[]): Promise<T | null> {
        const results = await this.query<T>(sql, params);
        return results[0] || null;
    }

    async execute(sql: string, params?: unknown[]): Promise<D1Result> {
        return await this.db.prepare(sql).bind(...(params || [])).run();
    }

    async batch(statements: D1PreparedStatement[]): Promise<D1Result[]> {
        return await this.db.batch(statements);
    }

    prepare(sql: string) {
        return this.db.prepare(sql);
    }
}

// Get database instance (for local dev, we'll use mock)
export function getDatabase(): DatabaseClient {
    // This will be properly configured with Cloudflare bindings
    // For now, return mock or throw error
    if (process.env.NODE_ENV === 'development') {
        // TODO: Setup local D1 with wrangler
        throw new Error('D1 database not configured for local development yet');
    }

    // In production, this will be available via Cloudflare Pages Functions
    // @ts-expect-error - env will be available in Cloudflare context
    return new DatabaseClient(env.DB);
}

// Helper function to get current Unix timestamp
export function getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
}

// Generate a random ID (simple implementation)
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
