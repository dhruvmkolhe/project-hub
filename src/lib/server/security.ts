import path from 'path';

/**
 * In-Memory Rate Limiter
 * Limits requests per IP address over a rolling time window.
 */
interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60 * 1000): { success: boolean; remaining: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(identifier, {
            count: 1,
            resetAt: now + windowMs
        });
        return { success: true, remaining: maxRequests - 1 };
    }

    if (entry.count >= maxRequests) {
        return { success: false, remaining: 0 };
    }

    entry.count += 1;
    return { success: true, remaining: maxRequests - entry.count };
}

// Clean up stale rate limit entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
        if (now > entry.resetAt) {
            rateLimitMap.delete(key);
        }
    }
}, 5 * 60 * 1000);

/**
 * Input Text Sanitizer
 * Strips HTML tags and escapes dangerous XSS entities.
 */
export function sanitizeText(input: string | null | undefined): string {
    if (!input || typeof input !== 'string') return '';

    return input
        .replace(/<[^>]*>/g, '') // Strip HTML tags
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

/**
 * File Upload Validator
 * Validates image size, MIME type, and extension to prevent malicious uploads.
 */
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateUploadedFile(file: File): { valid: boolean; error?: string; extension?: string } {
    if (!file || file.size === 0) {
        return { valid: false, error: 'File is empty' };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        return { valid: false, error: 'File size exceeds 5MB limit' };
    }

    if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
        return { valid: false, error: 'Invalid file format. Only PNG, JPG, JPEG, and WebP are allowed' };
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
        return { valid: false, error: 'Invalid file extension' };
    }

    return { valid: true, extension: ext };
}
