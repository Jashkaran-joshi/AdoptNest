/**
 * Rate limiting utility to prevent too many API requests
 * This is client-side protection only. Real rate limiting must be implemented on the backend.
 */

class RateLimiter {
    constructor() {
        // Store request timestamps for each endpoint
        this.requests = new Map();
        // Default: allow 10 requests per minute
        this.defaultLimit = {
            windowMs: 60000, // 1 minute in milliseconds
            maxRequests: 10, // Maximum requests allowed
        };
    }

    /**
     * Check if a request is allowed based on rate limit
     * @param {string} key - Unique identifier (e.g., "GET_/pets")
     * @param {object} options - Custom rate limit settings
     * @returns {boolean} - True if allowed, false if rate limited
     */
    isAllowed(key, options = {}) {
        const limit = { ...this.defaultLimit, ...options };
        const now = Date.now();
        const windowStart = now - limit.windowMs;

        // Initialize if this is the first request for this endpoint
        if (!this.requests.has(key)) {
            this.requests.set(key, []);
        }

        const requestTimes = this.requests.get(key);
        
        // Remove old requests that are outside the time window
        const recentRequests = requestTimes.filter((time) => time > windowStart);
        this.requests.set(key, recentRequests);

        // Check if we've exceeded the limit
        if (recentRequests.length >= limit.maxRequests) {
            return false;
        }

        // Add current request timestamp
        recentRequests.push(now);
        return true;
    }

    /**
     * Get how many requests are still allowed in the current time window
     * @param {string} key - Unique identifier
     * @param {object} options - Rate limit settings
     * @returns {number} - Number of remaining requests
     */
    getRemaining(key, options = {}) {
        const limit = { ...this.defaultLimit, ...options };
        const now = Date.now();
        const windowStart = now - limit.windowMs;

        if (!this.requests.has(key)) {
            return limit.maxRequests;
        }

        const requestTimes = this.requests.get(key);
        const recentRequests = requestTimes.filter((time) => time > windowStart);
        this.requests.set(key, recentRequests);

        return Math.max(0, limit.maxRequests - recentRequests.length);
    }

    /**
     * Reset rate limit for a specific endpoint
     * @param {string} key - Unique identifier
     */
    reset(key) {
        this.requests.delete(key);
    }

    /**
     * Clear all rate limits (useful for testing)
     */
    clear() {
        this.requests.clear();
    }
}

// Export a single instance that's shared across the app
export const rateLimiter = new RateLimiter();


