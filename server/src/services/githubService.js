/**
 * GitHub Service
 * Handles uploading files to GitHub repository via GitHub API
 * Used for automatically uploading images during seed generation
 */

const https = require('https');
const config = require('../config');

// GitHub API base URL
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Upload a file to GitHub repository
 * @param {string} filePath - Local path to the file
 * @param {string} repoPath - Path where file should be stored in repo (e.g., 'pets/pet-1.jpg')
 * @param {Buffer} fileContent - File content as Buffer
 * @param {string} commitMessage - Commit message
 * @returns {Promise<string>} The GitHub raw URL of the uploaded file
 */
async function uploadFileToGitHub(repoPath, fileContent, commitMessage = 'Add image file') {
  const owner = config.jsdelivr.githubOwner;
  const repo = config.jsdelivr.githubRepo;
  const branch = config.jsdelivr.githubBranch || 'main';
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo) {
    throw new Error('GitHub repository not configured. Set GITHUB_REPO_OWNER and GITHUB_REPO_NAME in .env');
  }

  if (!token) {
    throw new Error('GitHub token not configured. Set GITHUB_TOKEN in .env (Personal Access Token)');
  }

  // Convert file content to base64
  const content = fileContent instanceof Buffer ? fileContent.toString('base64') : Buffer.from(fileContent).toString('base64');

  try {
    // First, check if file exists and get its SHA if it does
    const existingFileSha = await getFileSha(owner, repo, branch, repoPath, token);

    // Prepare the request data
    const requestData = {
      message: commitMessage,
      content: content,
      branch: branch
    };

    // If file exists, include SHA to update it
    if (existingFileSha) {
      requestData.sha = existingFileSha;
    }

    // Upload/Update file using GitHub API
    const response = await makeGitHubRequest(
      `PUT`,
      `/repos/${owner}/${repo}/contents/${repoPath}`,
      requestData,
      token
    );

    // Return the raw GitHub URL (jsDelivr will handle the CDN)
    return response.content.html_url.replace('/blob/', '/raw/');
  } catch (error) {
    console.error(`Error uploading ${repoPath} to GitHub:`, error.message);
    throw error;
  }
}

/**
 * Get SHA of existing file in GitHub repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @param {string} filePath - Path to file in repository
 * @param {string} token - GitHub token
 * @returns {Promise<string|null>} SHA of file or null if doesn't exist
 */
async function getFileSha(owner, repo, branch, filePath, token) {
  try {
    const response = await makeGitHubRequest(
      'GET',
      `/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}?ref=${branch}`,
      null,
      token
    );
    return response.sha || null;
  } catch (error) {
    // File doesn't exist (404), return null
    if (error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Make HTTP request to GitHub API
 * @param {string} method - HTTP method (GET, PUT, POST, etc.)
 * @param {string} path - API path (without base URL)
 * @param {object} data - Request body data
 * @param {string} token - GitHub authentication token
 * @returns {Promise<object>} Response data
 */
function makeGitHubRequest(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const url = `${GITHUB_API_BASE}${path}`;
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'AdoptNest-Seed-Script',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            const error = new Error(parsed.message || `GitHub API error: ${res.statusCode}`);
            error.statusCode = res.statusCode;
            error.response = parsed;
            reject(error);
          }
        } catch (parseError) {
          const error = new Error(`Failed to parse GitHub API response: ${parseError.message}`);
          error.statusCode = res.statusCode;
          error.response = responseData;
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Upload multiple files to GitHub repository
 * @param {Array<{repoPath: string, fileContent: Buffer, commitMessage?: string}>} files - Array of files to upload
 * @returns {Promise<Array<{repoPath: string, url: string}>>} Array of uploaded file paths and URLs
 */
async function uploadMultipleFiles(files) {
  const results = [];
  const errors = [];

  for (const file of files) {
    try {
      const url = await uploadFileToGitHub(
        file.repoPath,
        file.fileContent,
        file.commitMessage || `Add ${file.repoPath}`
      );
      results.push({
        repoPath: file.repoPath,
        url: url,
        success: true
      });
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      errors.push({
        repoPath: file.repoPath,
        error: error.message,
        success: false
      });
      console.error(`Failed to upload ${file.repoPath}:`, error.message);
    }
  }

  if (errors.length > 0) {
    console.warn(`⚠️  ${errors.length} file(s) failed to upload to GitHub`);
  }

  return { results, errors };
}

/**
 * Check if GitHub token is configured and valid
 * @returns {Promise<boolean>} True if token is valid
 */
async function validateGitHubToken() {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    return false;
  }

  try {
    const response = await makeGitHubRequest('GET', '/user', null, token);
    return !!response.login;
  } catch (error) {
    return false;
  }
}

module.exports = {
  uploadFileToGitHub,
  uploadMultipleFiles,
  validateGitHubToken,
  makeGitHubRequest
};
