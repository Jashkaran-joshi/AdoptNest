/**
 * Environment Variable Utilities
 * Centralized validation and access for environment variables
 */

/**
 * Validates that required environment variables are set
 * Throws error in development if missing, logs warning in production
 */
export function validateEnv() {
  const required = {
    VITE_API_BASE: import.meta.env.VITE_API_BASE,
  };

  const missing = [];
  const warnings = [];

  // Check required variables
  if (!required.VITE_API_BASE) {
    missing.push('VITE_API_BASE');
  } else {
    // Validate API base URL format
    try {
      const url = new URL(required.VITE_API_BASE);
      if (!url.pathname.endsWith('/api')) {
        warnings.push('VITE_API_BASE should end with /api');
      }
      // Check for mixed content (http on https page)
      if (import.meta.env.PROD && url.protocol === 'http:') {
        warnings.push('VITE_API_BASE uses http:// in production. This may cause mixed-content issues.');
      }
    } catch (e) {
      warnings.push('VITE_API_BASE is not a valid URL');
    }
  }

  // Log errors in development
  if (import.meta.env.DEV) {
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing.join(', '));
      console.error('📝 Create a .env.local file in the client directory with:');
      missing.forEach((varName) => {
        console.error(`   ${varName}=your-value-here`);
      });
      console.error('📖 See client/.env.example for reference');
    }
    if (warnings.length > 0) {
      warnings.forEach((warning) => {
        console.warn('⚠️', warning);
      });
    }
  }

  // In production, log warnings but don't throw
  if (import.meta.env.PROD && (missing.length > 0 || warnings.length > 0)) {
    console.warn('Environment variable issues detected:', { missing, warnings });
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Get API base URL with validation
 * @returns {string} API base URL
 */
export function getApiBaseUrl() {
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
  
  if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE) {
    console.warn('⚠️ VITE_API_BASE not set, using default: http://localhost:5000/api');
  }
  
  return apiBase;
}

/**
 * Get environment information
 * @returns {object} Environment info
 */
export function getEnvInfo() {
  return {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    apiBase: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
    errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  };
}

// Validate on module load (only in development)
if (import.meta.env.DEV) {
  validateEnv();
}

