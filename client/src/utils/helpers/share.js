/**
 * Share utility functions for social sharing
 * These functions help users share content on social media or copy links
 */

/**
 * Share content using the browser's native share dialog (if available)
 * If not available, falls back to copying the link to clipboard
 * 
 * @param {Object} options - What to share
 * @param {string} options.title - Title of the content
 * @param {string} options.text - Description text
 * @param {string} options.url - URL to share
 * @returns {Object} - Result with success status and method used
 */
export const shareContent = async ({ title, text, url }) => {
    const shareData = {
        title: title || document.title,
        text: text || "",
        url: url || window.location.href,
    };

    // Try native share dialog (works on mobile and some desktop browsers)
    if (navigator.share) {
        try {
            await navigator.share(shareData);
            return { success: true, method: "native" };
        } catch (error) {
            // User cancelled sharing - that's okay, don't show error
            if (error.name !== "AbortError") {
                console.error("Error sharing:", error);
            }
            return { success: false, error: error.message };
        }
    } else {
        // Fallback: Copy link to clipboard
        try {
            const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
            await navigator.clipboard.writeText(shareText);
            return { success: true, method: "clipboard" };
        } catch (error) {
            console.error("Error copying to clipboard:", error);
            return { success: false, error: error.message };
        }
    }
};

/**
 * Share to a specific social media platform
 * Opens a new window with the platform's share dialog
 * 
 * @param {string} platform - Platform name: "facebook", "twitter", "whatsapp", "linkedin", or "email"
 * @param {Object} options - What to share
 * @param {string} options.title - Title of the content
 * @param {string} options.text - Description text
 * @param {string} options.url - URL to share
 * @returns {Object} - Result with success status
 */
export const shareToPlatform = (platform, { title, text, url }) => {
    // Encode special characters for URLs
    const encodedTitle = encodeURIComponent(title || document.title);
    const encodedText = encodeURIComponent(text || "");
    const encodedUrl = encodeURIComponent(url || window.location.href);
    const fullText = `${encodedTitle} - ${encodedText}`;

    // URLs for each platform's share dialog
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=${fullText}&url=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${fullText}%20${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`,
    };

    const shareUrl = shareUrls[platform.toLowerCase()];
    if (shareUrl) {
        // Open share dialog in a new window
        window.open(shareUrl, "_blank", "width=600,height=400");
        return { success: true, platform };
    }
    return { success: false, error: "Platform not supported" };
};

