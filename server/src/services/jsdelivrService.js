/**
 * jsDelivr CDN Service
 * Handles generating and managing jsDelivr CDN URLs for images stored in GitHub
 */

const config = require('../config');

/**
 * Generate jsDelivr CDN URL for an image
 * @param {string} imagePath - Path to image in GitHub repo (e.g., 'pets/dog.jpg')
 * @param {string} category - Optional category folder
 * @returns {string} jsDelivr CDN URL
 */
function getJsDelivrUrl(imagePath, category = null) {
  // Get configuration from environment
  const githubOwner = config.jsdelivr.githubOwner;
  const githubRepo = config.jsdelivr.githubRepo;
  const githubBranch = config.jsdelivr.githubBranch || 'main';

  if (!githubOwner || !githubRepo) {
    console.warn('⚠️  GitHub owner/repo not configured for jsDelivr. Using placeholder URL.');
    return getPlaceholderUrl(category);
  }

  // If imagePath is already a full URL (jsDelivr, GitHub, or other), return as-is
  if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
    // Check if it's already a jsDelivr URL - return as-is
    if (imagePath.includes('cdn.jsdelivr.net') || imagePath.includes('raw.githubusercontent.com')) {
      return imagePath;
    }
    // If it's a GitHub raw URL, convert to jsDelivr
    if (imagePath.includes('raw.githubusercontent.com')) {
      return convertGitHubRawToJsDelivr(imagePath);
    }
    // For other URLs (like placeholders), return as-is
    return imagePath;
  }

  // Build path - ensure it doesn't start with a slash
  let fullPath = imagePath.trim();
  if (fullPath.startsWith('/')) {
    fullPath = fullPath.substring(1);
  }
  
  // If category is provided and not already in the path, prepend it
  if (category && !fullPath.startsWith(category + '/')) {
    fullPath = `${category}/${fullPath}`;
  }

  // Generate jsDelivr CDN URL
  // Format: https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/{path}
  const cdnUrl = `https://cdn.jsdelivr.net/gh/${githubOwner}/${githubRepo}@${githubBranch}/${fullPath}`;

  return cdnUrl;
}

/**
 * Convert GitHub raw URL to jsDelivr CDN URL
 * @param {string} githubRawUrl - GitHub raw URL
 * @returns {string} jsDelivr CDN URL
 */
function convertGitHubRawToJsDelivr(githubRawUrl) {
  // Parse GitHub raw URL: https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}
  const match = githubRawUrl.match(/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/);
  if (match) {
    const [, owner, repo, branch, path] = match;
    return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`;
  }
  return githubRawUrl; // Return as-is if can't parse
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

/**
 * Validate jsDelivr URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid jsDelivr URL
 */
function isValidJsDelivrUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('cdn.jsdelivr.net') || url.includes('raw.githubusercontent.com');
}

/**
 * Extract image path from jsDelivr URL
 * @param {string} url - jsDelivr URL
 * @returns {string|null} Image path or null
 */
function extractPathFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  // Parse jsDelivr URL: https://cdn.jsdelivr.net/gh/{user}/{repo}@{branch}/{path}
  const jsdelivrMatch = url.match(/cdn\.jsdelivr\.net\/gh\/[^\/]+\/[^\/]+@[^\/]+\/(.+)/);
  if (jsdelivrMatch) {
    return jsdelivrMatch[1];
  }
  
  // Parse GitHub raw URL: https://raw.githubusercontent.com/{user}/{repo}/{branch}/{path}
  const githubMatch = url.match(/raw\.githubusercontent\.com\/[^\/]+\/[^\/]+\/[^\/]+\/(.+)/);
  if (githubMatch) {
    return githubMatch[1];
  }
  
  return null;
}

module.exports = {
  getJsDelivrUrl,
  convertGitHubRawToJsDelivr,
  getPlaceholderUrl,
  isValidJsDelivrUrl,
  extractPathFromUrl
};

