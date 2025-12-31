import { NextRequest, NextResponse } from 'next/server';
import { PasteService } from '@/lib/paste.service';
import { pasteIdSchema } from '@/lib/validators';
import { AppError } from '@/lib/errors';
import { ZodError } from 'zod';

// GET /api/pastes/:id - Fetch a paste by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Validate paste ID
        pasteIdSchema.parse(id);

        // Consume paste using service
        const result = await PasteService.consumePaste(id, request.headers);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching paste:', error);

        // Handle Zod validation errors
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Invalid paste ID' },
                { status: 400 }
            );
        }

        // Handle custom app errors (NotFound, Expired, ViewLimit)
        if (error instanceof AppError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.statusCode }
            );
        }

        // Handle unexpected errors
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
