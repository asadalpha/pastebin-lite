// Get current time, respecting TEST_MODE
export function getCurrentTime(headers?: Headers): Date {
    const testMode = process.env.TEST_MODE === '1';

    if (testMode && headers) {
        const testNowMs = headers.get('x-test-now-ms');
        if (testNowMs) {
            const timestamp = parseInt(testNowMs, 10);
            if (!isNaN(timestamp)) {
                return new Date(timestamp);
            }
        }
    }

    return new Date();
}

// Calculate expiry time from TTL
export function calculateExpiryTime(ttlSeconds: number, currentTime: Date): Date {
    return new Date(currentTime.getTime() + ttlSeconds * 1000);
}

// Check if a paste has expired
export function isPasteExpired(expiresAt: Date | null, currentTime: Date): boolean {
    if (!expiresAt) return false;
    return currentTime >= expiresAt;
}
