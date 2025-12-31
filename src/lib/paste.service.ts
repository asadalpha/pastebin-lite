import { db } from '@/db/client';
import { pastes } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { generatePasteId } from '@/lib/utils';
import { getCurrentTime, calculateExpiryTime, isPasteExpired } from '@/lib/time';
import {
    NotFoundError,
    PasteExpiredError,
    ViewLimitExceededError
} from '@/lib/errors';
import type { CreatePasteInput } from '@/lib/validators';

export interface CreatePasteResult {
    id: string;
    url: string;
}

export interface ConsumeResult {
    content: string;
    remaining_views: number | null;
    expires_at: string | null;
}

export class PasteService {
    /**
     * Create a new paste
     */
    static async createPaste(
        input: CreatePasteInput,
        headers: Headers
    ): Promise<CreatePasteResult> {
        const pasteId = generatePasteId();
        const currentTime = getCurrentTime(headers);

        // Calculate expiry time if TTL is provided
        const expiresAt = input.ttl_seconds
            ? calculateExpiryTime(input.ttl_seconds, currentTime)
            : null;

        // Insert paste into database
        await db.insert(pastes).values({
            pasteId,
            content: input.content,
            expiresAt,
            maxViews: input.max_views ?? null,
            viewCount: 0,
        });

        // Build the full URL
        const protocol = headers.get('x-forwarded-proto') || 'http';
        const host = headers.get('host') || 'localhost:3000';
        const url = `${protocol}://${host}/p/${pasteId}`;

        return { id: pasteId, url };
    }

    /**
     * Consume a paste (fetch and increment view count)
     */
    static async consumePaste(
        pasteId: string,
        headers: Headers
    ): Promise<ConsumeResult> {
        // Fetch paste from database
        const result = await db
            .select()
            .from(pastes)
            .where(eq(pastes.pasteId, pasteId))
            .limit(1);

        if (result.length === 0) {
            throw new NotFoundError('Paste not found');
        }

        const paste = result[0];
        const currentTime = getCurrentTime(headers);

        // Check if paste has expired
        if (isPasteExpired(paste.expiresAt, currentTime)) {
            throw new PasteExpiredError('Paste has expired');
        }

        // Check if view limit has been exceeded (before incrementing)
        if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
            throw new ViewLimitExceededError('Paste view limit exceeded');
        }

        // Increment view count atomically
        await db
            .update(pastes)
            .set({ viewCount: sql`${pastes.viewCount} + 1` })
            .where(eq(pastes.pasteId, pasteId));

        // Calculate remaining views
        const newViewCount = paste.viewCount + 1;
        const remainingViews = paste.maxViews !== null
            ? paste.maxViews - newViewCount
            : null;

        return {
            content: paste.content,
            remaining_views: remainingViews,
            expires_at: paste.expiresAt ? paste.expiresAt.toISOString() : null,
        };
    }

    /**
     * Get paste for display (without incrementing view count)
     */
    static async getPasteForDisplay(
        pasteId: string,
        headers: Headers
    ) {
        // Fetch paste from database
        const result = await db
            .select()
            .from(pastes)
            .where(eq(pastes.pasteId, pasteId))
            .limit(1);

        if (result.length === 0) {
            throw new NotFoundError('Paste not found');
        }

        const paste = result[0];
        const currentTime = getCurrentTime(headers);

        // Check if paste has expired
        if (isPasteExpired(paste.expiresAt, currentTime)) {
            throw new PasteExpiredError('Paste has expired');
        }

        // Check if view limit has been exceeded
        if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
            throw new ViewLimitExceededError('Paste view limit exceeded');
        }

        return {
            id: pasteId,
            content: paste.content,
            maxViews: paste.maxViews,
            viewCount: paste.viewCount,
            expiresAt: paste.expiresAt,
        };
    }
}
