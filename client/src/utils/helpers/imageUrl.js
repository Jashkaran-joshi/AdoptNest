import { getJsDelivrUrl } from '../../services/jsdelivr';

/**
 * Get the full URL for an image
 * Handles jsDelivr CDN URLs, GitHub URLs, and local paths
 * @param {string} imagePath - The image path from the database
 * @returns {string} The full URL to the image
 */
export function getImageUrl(imagePath) {
  if (!imagePath) {
    return null;
  }

  // If it's already a full URL (http/https), return as is
  const trimmedPath = imagePath.trim();
  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
    // jsDelivr, GitHub, or other CDN URLs are already complete - return as-is
    return trimmedPath.endsWith('/') && !trimmedPath.endsWith('://') ? trimmedPath.slice(0, -1) : trimmedPath;
  }

  // Try to convert relative path to jsDelivr URL
  try {
    // Extract category if path looks like category/path
    const pathParts = trimmedPath.split('/');
    const category = pathParts.length > 1 ? pathParts[0] : null;
    const jsdelivrUrl = getJsDelivrUrl(trimmedPath, category);
    return jsdelivrUrl;
  } catch (error) {
    // Fallback to API base URL construction below
  }

  // Get API base URL from environment
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
  
  // Validate API base URL
  if (!apiBase) {
    if (import.meta.env.DEV) {
      console.warn('⚠️ VITE_API_BASE is not set. Using default localhost URL.');
    }
    // Don't return null - try to construct URL anyway
  }

  // Extract server base URL (remove /api suffix if present)
  let serverBase = apiBase.trim();
  
  // Remove trailing slash from API base
  if (serverBase.endsWith('/')) {
    serverBase = serverBase.slice(0, -1);
  }
  
  // Remove /api suffix if present (handle both /api and /api/)
  if (serverBase.endsWith('/api')) {
    serverBase = serverBase.slice(0, -4);
  }
  
  // Ensure serverBase doesn't have trailing slash
  if (serverBase.endsWith('/')) {
    serverBase = serverBase.slice(0, -1);
  }

  // Handle relative paths
  if (imagePath.startsWith('/')) {
    // Path already starts with /, just concatenate
    const fullUrl = `${serverBase}${imagePath}`;
    
    // Validate URL construction in development
    if (import.meta.env.DEV) {
      try {
        new URL(fullUrl); // Validate URL format
      } catch (e) {
        console.warn('⚠️ Invalid image URL constructed:', fullUrl, 'from path:', imagePath);
      }
    }
    
    return fullUrl;
  }

  // If it doesn't start with /, assume it's a relative path and add /
  const fullUrl = `${serverBase}/${imagePath}`;
  
  // Validate URL construction in development
  if (import.meta.env.DEV) {
    try {
      new URL(fullUrl); // Validate URL format
    } catch (e) {
      console.warn('⚠️ Invalid image URL constructed:', fullUrl, 'from path:', imagePath);
    }
  }
  
  return fullUrl;
}

import { PLACEHOLDER_IMAGES } from '../../constants';

/**
 * Get image URL with fallback
 * @param {string} imagePath - The image path from the database
 * @param {string} fallback - Fallback image URL if imagePath is missing
 * @returns {string} The full URL to the image or fallback
 */
export function getImageUrlWithFallback(imagePath, fallback = PLACEHOLDER_IMAGES.DEFAULT) {
  // Always return a valid URL - use fallback if imagePath is missing
  if (!imagePath || imagePath.trim() === '') {
    if (import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true') {
      console.warn('⚠️ Empty image path, using fallback:', fallback);
    }
    return fallback;
  }
  
  const url = getImageUrl(imagePath);
  
  // If URL construction failed, return fallback
  if (!url) {
    if (import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true') {
      console.warn('⚠️ Failed to construct image URL for:', imagePath, 'Using fallback:', fallback);
    }
    return fallback;
  }
  
  // Log jsDelivr URLs in debug mode
  if ((import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true') && (url.includes('cdn.jsdelivr.net') || url.includes('raw.githubusercontent.com'))) {
    console.log('✅ jsDelivr CDN image URL:', url);
  }
  
  return url;
}

/**
 * Validate if a jsDelivr CDN image URL is accessible
 * @param {string} url - The image URL to validate
 * @returns {Promise<{accessible: boolean, status?: number, error?: string}>}
 */
export async function validateJsDelivrUrl(url) {
  if (!url || (!url.includes('cdn.jsdelivr.net') && !url.includes('raw.githubusercontent.com'))) {
    return { accessible: false, error: 'Not a jsDelivr/GitHub URL' };
  }
  
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors' // Avoid CORS issues, we just want to know if request completes
    });
    return { accessible: true, status: response.status || 200 };
  } catch (error) {
    return { accessible: false, error: error.message };
  }
}

/**
 * Validate if an image URL is accessible
 * @param {string} url - The image URL to validate
 * @returns {Promise<boolean>} True if image is accessible
 */
export async function validateImageUrl(url) {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get image URL with error handling and retry
 * @param {string} imagePath - The image path from the database
 * @param {string} fallback - Fallback image URL if imagePath is missing or fails
 * @returns {string} The full URL to the image or fallback
 */
export function getImageUrlSafe(imagePath, fallback = PLACEHOLDER_IMAGES.DEFAULT) {
  try {
    return getImageUrlWithFallback(imagePath, fallback);
  } catch (error) {
    console.error('Error constructing image URL:', error);
    return fallback;
  }
}

/**
 * Get placeholder image URL based on context
 * @param {string} context - The context (PET_CARD, PET_DETAIL, BLOG_CARD, etc.)
 * @returns {string} The placeholder image URL
 */
export function getPlaceholderImage(context = 'DEFAULT') {
  return PLACEHOLDER_IMAGES[context] || PLACEHOLDER_IMAGES.DEFAULT;
}

