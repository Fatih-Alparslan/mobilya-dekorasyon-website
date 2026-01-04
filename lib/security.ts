import crypto from 'crypto';

// Rate limiting için basit in-memory store
interface RateLimitEntry {
    count: number;
    resetTime: number;
    blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxAttempts: number; // Max attempts in window
    blockDurationMs?: number; // How long to block after max attempts
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address or username)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining attempts
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number; blockedUntil?: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // Check if currently blocked
    if (entry?.blockedUntil && entry.blockedUntil > now) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime,
            blockedUntil: entry.blockedUntil,
        };
    }

    // Reset if window expired
    if (!entry || entry.resetTime < now) {
        const newEntry: RateLimitEntry = {
            count: 1,
            resetTime: now + config.windowMs,
        };
        rateLimitStore.set(identifier, newEntry);
        return {
            allowed: true,
            remaining: config.maxAttempts - 1,
            resetTime: newEntry.resetTime,
        };
    }

    // Increment count
    entry.count++;

    // Check if exceeded
    if (entry.count > config.maxAttempts) {
        if (config.blockDurationMs) {
            entry.blockedUntil = now + config.blockDurationMs;
        }
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime,
            blockedUntil: entry.blockedUntil,
        };
    }

    return {
        allowed: true,
        remaining: config.maxAttempts - entry.count,
        resetTime: entry.resetTime,
    };
}

/**
 * Reset rate limit for an identifier (e.g., after successful login)
 */
export function resetRateLimit(identifier: string): void {
    rateLimitStore.delete(identifier);
}

/**
 * Get client IP address from request headers
 */
export function getClientIp(request: Request): string {
    // Check common headers for real IP (useful behind proxies/CDNs)
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // Fallback to a default (won't work in production but prevents errors)
    return 'unknown';
}

/**
 * Generate a secure session token
 */
export function generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a session token for storage
 */
export function hashSessionToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Check if request is from HTTPS
 */
export function isSecureConnection(request: Request): boolean {
    const proto = request.headers.get('x-forwarded-proto');
    return proto === 'https' || request.url.startsWith('https://');
}

/**
 * Validate IP whitelist (if configured)
 */
export function isIpWhitelisted(ip: string, whitelist?: string[]): boolean {
    if (!whitelist || whitelist.length === 0) {
        return true; // No whitelist = all IPs allowed
    }
    return whitelist.includes(ip);
}

/**
 * Generate a time-based one-time password (TOTP) secret
 */
export function generateTOTPSecret(): string {
    return crypto.randomBytes(20).toString("base64");
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .trim()
        .slice(0, 1000); // Limit length
}
