/**
 * jsDelivr CDN Service for Frontend
 * Handles generating jsDelivr CDN URLs
 */

const GITHUB_USER = import.meta.env.VITE_GITHUB_USER;
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO;
const GITHUB_BRANCH = import.meta.env.VITE_GITHUB_BRANCH || 'main';
const GITHUB_BASE_PATH = import.meta.env.VITE_GITHUB_BASE_PATH || '';

/**
 * Generate jsDelivr CDN URL for an image
 * @param {string} imagePath - Path to image in GitHub repo (e.g., 'pets/dog.jpg')
 * @param {string} category - Optional category folder
 * @returns {string} jsDelivr CDN URL
 */
export function getJsDelivrUrl(imagePath, category = null) {
  // If imagePath is already a full URL, return as-is
  if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
    return imagePath;
  }

  // If GitHub user/repo not configured, return placeholder
  if (!GITHUB_USER || !GITHUB_REPO) {
    console.warn('⚠️  GitHub user/repo not configured for jsDelivr. Using placeholder URL.');
    return getPlaceholderUrl(category);
  }

  // Build path
  let fullPath = imagePath;
  if (category && !imagePath.startsWith(category)) {
    fullPath = `${category}/${imagePath}`;
  }
  
  // Add base path if configured
  if (GITHUB_BASE_PATH) {
    fullPath = `${GITHUB_BASE_PATH}/${fullPath}`.replace(/\/+/g, '/');
  }
  
  // Remove leading slash if present
  fullPath = fullPath.replace(/^\/+/, '');

  // Generate jsDelivr CDN URL
  // Format: https://cdn.jsdelivr.net/gh/{user}/{repo}@{branch}/{path}
  const cdnUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@${GITHUB_BRANCH}/${fullPath}`;

  return cdnUrl;
}

/**
 * Get placeholder image URL
 * @param {string} category - Image category
 * @returns {string} Placeholder URL
 */
function getPlaceholderUrl(category = null) {
  const placeholders = {
    pets: 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Pet+Image',
    blog: 'https://via.placeholder.com/800x400/e2e8f0/64748b?text=Blog+Image',
    stories: 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Story+Image',
    users: 'https://via.placeholder.com/100x100/e2e8f0/64748b?text=User',
    default: 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Image'
  };
  
  return placeholders[category] || placeholders.default;
}

