/**
 * Input sanitization utilities to prevent XSS attacks
 * These functions clean user input to make it safe for use in the application
 */

/**
 * Sanitizes an object by recursively sanitizing all string values
 * This removes dangerous characters from nested objects and arrays
 * @param {object} obj - The object to sanitize
 * @returns {object} - Sanitized object safe to use
 */
export function sanitizeObject(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === "string") {
        return sanitizeInput(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => sanitizeObject(item));
    }

    if (typeof obj === "object") {
        const sanitized = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                sanitized[key] = sanitizeObject(obj[key]);
            }
        }
        return sanitized;
    }

    return obj;
}

/**
 * Sanitizes user input for form fields (removes dangerous characters)
 * @param {string} input - The input string
 * @returns {string} - Sanitized string
 */
export function sanitizeInput(input) {
    if (typeof input !== "string") {
        return String(input || "");
    }

    // Remove null bytes and control characters (excluding common whitespace)
    return input
        .replace(/\0/g, "")
        .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "")
        .trim();
}

/**
 * Validates and sanitizes email address
 * @param {string} email - Email to validate and sanitize
 * @returns {string|null} - Sanitized email or null if invalid
 */
export function sanitizeEmail(email) {
    if (typeof email !== "string") {
        return null;
    }

    const sanitized = sanitizeInput(email.toLowerCase().trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(sanitized) ? sanitized : null;
}


