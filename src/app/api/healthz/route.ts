import { NextResponse } from 'next/server';
import { db } from '@/db/client';

export async function GET() {
    try {
        // Test database connection
        await db.execute('SELECT 1');

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json({ ok: false }, { status: 200 });
    }
}
