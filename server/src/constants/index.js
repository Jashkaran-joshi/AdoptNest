/**
 * Application Constants
 * Centralized constants for the entire application
 */

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// User Roles
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// User Status
const USER_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
};

// Pet Status
const PET_STATUS = {
  AVAILABLE: 'Available',
  PENDING: 'Pending',
  ADOPTED: 'Adopted',
};

// Pet Types
const PET_TYPES = {
  DOG: 'Dog',
  CAT: 'Cat',
  BIRD: 'Bird',
  RABBIT: 'Rabbit',
  OTHER: 'Other',
};

// Adoption Request Status
const ADOPTION_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

// Surrender Status
const SURRENDER_STATUS = {
  PENDING: 'Pending',
  PROCESSED: 'Processed',
};

// Booking Status
const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
};

// Volunteer Status
const VOLUNTEER_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

// Donation Contact Status
const DONATION_CONTACT_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

// Donation Contact Purpose
const DONATION_PURPOSE = {
  GENERAL: 'general',
  SPONSOR_PET: 'sponsor-pet',
  MONTHLY_SUPPORT: 'monthly-support',
  ONE_TIME: 'one-time',
  OTHER: 'other',
};

// Contact Message Status
const CONTACT_MESSAGE_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
};

// File Upload
const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  USER_STATUS,
  PET_STATUS,
  PET_TYPES,
  ADOPTION_STATUS,
  SURRENDER_STATUS,
  BOOKING_STATUS,
  VOLUNTEER_STATUS,
  DONATION_CONTACT_STATUS,
  DONATION_PURPOSE,
  CONTACT_MESSAGE_STATUS,
  UPLOAD,
  PAGINATION,
};

