/**
 * Centralized error handling utility
 */

/**
 * Formats error message for display to user
 * @param {Error|object} error - Error object
 * @returns {string} - User-friendly error message
 */
export function formatErrorMessage(error) {
    if (!error) {
        return "An unexpected error occurred. Please try again.";
    }

    // Handle API error format
    if (error.message) {
        return error.message;
    }

    // Handle error objects with status codes
    if (error.status) {
        switch (error.status) {
            case 400:
                return "Invalid request. Please check your input.";
            case 401:
                return "Your session has expired. Please log in again.";
            case 403:
                return "You don't have permission to perform this action.";
            case 404:
                return "The requested resource was not found.";
            case 408:
                return "Request timed out. Please try again.";
            case 409:
                return "A conflict occurred. Please refresh and try again.";
            case 422:
                return "Validation failed. Please check your input.";
            case 429:
                return "Too many requests. Please wait before trying again.";
            case 500:
                return "Server error. Please try again later.";
            case 503:
                return "Service temporarily unavailable. Please try again later.";
            default:
                return `An error occurred (${error.status}). Please try again.`;
        }
    }

    // Handle network errors
    if (error.code === "NETWORK_ERROR" || error.code === "TIMEOUT") {
        return error.message || "Network error. Please check your connection.";
    }

    // Handle rate limit errors
    if (error.code === "RATE_LIMIT_EXCEEDED") {
        return error.message || "Too many requests. Please wait before trying again.";
    }

    // Fallback
    return "An unexpected error occurred. Please try again.";
}

/**
 * Logs error for debugging (only in development)
 * @param {Error|object} error - Error object
 * @param {string} context - Context where error occurred
 */
export function logError(error, context = "Unknown") {
    // Use Vite's built-in DEV mode check (more reliable than custom env var)
    if (import.meta.env.DEV) {
        console.error(`[${context}]`, error);
    }
    // In production, you might want to send to error tracking service
    // if (import.meta.env.VITE_ENABLE_ERROR_REPORTING === "true") {
    //     // Send to error tracking service (e.g., Sentry, LogRocket)
    // }
}

/**
 * Handles API errors with proper user feedback
 * @param {Error|object} error - Error object
 * @param {Function} setError - State setter for error message
 * @param {string} context - Context where error occurred
 */
export function handleApiError(error, setError, context = "API Call") {
    logError(error, context);
    const message = formatErrorMessage(error);
    setError(message);
}


