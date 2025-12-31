import { customAlphabet } from 'nanoid';

// Generate a URL-safe random ID for pastes
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10);

export function generatePasteId(): string {
    return nanoid();
}
