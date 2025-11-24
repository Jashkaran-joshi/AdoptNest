/**
 * Application Constants
 * Centralized constants for the frontend
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
  TIMEOUT: 30000, // 30 seconds
};

// Routes
export const ROUTES = {
  HOME: '/',
  ADOPT: '/adopt',
  GIVE: '/give',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  BLOG: '/blog',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  DONATE: '/donate',
  VOLUNTEER: '/volunteer',
  SUCCESS_STORIES: '/success-stories',
  PRIVACY: '/privacy',
  TERMS: '/terms',
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Pet Types
export const PET_TYPES = {
  DOG: 'Dog',
  CAT: 'Cat',
  BIRD: 'Bird',
  RABBIT: 'Rabbit',
  OTHER: 'Other',
};

// Pet Status
export const PET_STATUS = {
  AVAILABLE: 'Available',
  PENDING: 'Pending',
  ADOPTED: 'Adopted',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'adoptnest_token',
  THEME: 'adoptnest_theme',
  FAVORITES: 'adoptnest_favorites',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 9,
  ITEMS_PER_PAGE_ADMIN: 20,
};

// File Upload
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
};

// Placeholder Images - Using CORS-friendly placeholder service
// Using placeholder.com which supports CORS
export const PLACEHOLDER_IMAGES = {
  PET_CARD: 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Pet+Image',
  PET_DETAIL: 'https://via.placeholder.com/600x400/e2e8f0/64748b?text=Pet+Image',
  PET_LARGE: 'https://via.placeholder.com/800x600/e2e8f0/64748b?text=Pet+Image',
  BLOG_CARD: 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Blog+Image',
  BLOG_POST: 'https://via.placeholder.com/800x400/e2e8f0/64748b?text=Blog+Image',
  STORY: 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Story+Image',
  USER_AVATAR: 'https://via.placeholder.com/100x100/e2e8f0/64748b?text=User',
  DEFAULT: 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Image',
};

