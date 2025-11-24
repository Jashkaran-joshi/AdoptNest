const { z } = require('zod');

// Auth validation
const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().trim().optional(),
  city: z.string().trim().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required')
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim()
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Pet validation
const petSchema = z.object({
  name: z.string().min(1, 'Pet name is required').trim(),
  type: z.enum(['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']),
  breed: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  age: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().positive().optional()
  ),
  ageGroup: z.enum(['Young', 'Adult', 'Senior']).optional(),
  gender: z.enum(['Male', 'Female']).optional(),
  location: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  description: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  status: z.enum(['Available', 'Adopted', 'Pending']).optional(),
  featured: z.boolean().optional(),
  image: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().optional()
  )
});

// Adoption validation
const adoptionSchema = z.object({
  petId: z.string().min(1, 'Pet ID is required'),
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address').trim(),
  phone: z.string().min(1, 'Phone is required').trim(),
  address: z.string().min(1, 'Address is required').trim(),
  city: z.string().min(1, 'City is required').trim(),
  experience: z.string().trim().optional(),
  reason: z.string().min(1, 'Reason is required').trim(),
  otherPets: z.boolean().optional(),
  otherPetsDetails: z.string().trim().optional(),
  homeType: z.enum(['apartment', 'house', 'condo', 'other']).optional(),
  yard: z.boolean().optional(),
  hoursAlone: z.string().min(1, 'Hours alone is required').trim(),
  references: z.string().trim().optional()
});

// Surrender validation
const surrenderSchema = z.object({
  name: z.string().min(1, 'Pet name is required').trim(),
  type: z.enum(['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']),
  age: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().positive().optional()
  ),
  reason: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  contact: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().email('Invalid email address').trim().optional()
  ),
  phone: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  )
});

// Booking validation
const bookingSchema = z.object({
  petId: z.string().optional(),
  service: z.enum(['Grooming', 'Vet / Doctor', 'Boarding (per night)', 'Daycare (per day)', 'Training Session']),
  date: z.preprocess(
    (val) => {
      if (!val) return undefined;
      // If it's already a Date object, return it
      if (val instanceof Date) return val;
      // If it's a string, parse it
      if (typeof val === 'string') {
        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? undefined : parsed;
      }
      return val;
    },
    z.date()
  ),
  time: z.string().min(1, 'Time is required'),
  qty: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return 1;
      const num = Number(val);
      return isNaN(num) ? 1 : num;
    },
    z.number().min(1).default(1).optional()
  ),
  notes: z.string().trim().optional(),
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address').trim(),
  phone: z.string().trim().optional()
});

// Contact validation
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address').trim(),
  message: z.string().min(10, 'Message must be at least 10 characters').trim()
});

// User profile validation
const updateProfileSchema = z.object({
  name: z.string().min(1).trim().optional(),
  phone: z.string().trim().optional(),
  city: z.string().trim().optional()
});

// Admin user update validation
const adminUserUpdateSchema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  status: z.enum(['active', 'suspended']).optional()
});

// Status update validation
const statusUpdateSchema = z.object({
  status: z.string().min(1, 'Status is required')
});

// Success Story validation
const successStorySchema = z.object({
  petName: z.string().min(1, 'Pet name is required').trim(),
  petType: z.enum(['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']),
  adopterName: z.string().min(1, 'Adopter name is required').trim(),
  location: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  story: z.string().min(1, 'Story is required').trim(),
  image: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().optional()
  ),
  adoptedDate: z.preprocess(
    (val) => {
      if (!val) return undefined;
      if (val instanceof Date) return val;
      if (typeof val === 'string') {
        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? undefined : parsed;
      }
      return val;
    },
    z.date().optional()
  ),
  rating: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return 5;
      const num = Number(val);
      return isNaN(num) ? 5 : num;
    },
    z.number().min(1).max(5).default(5).optional()
  ),
  published: z.boolean().optional()
});

// Volunteer validation
const volunteerSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  city: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  type: z.enum(['volunteer', 'foster']),
  availability: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  experience: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  why: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  status: z.enum(['Pending', 'Approved', 'Rejected']).optional()
});

// Donation Contact validation
const donationContactSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  purpose: z.enum(['general', 'sponsor-pet', 'monthly-support', 'one-time', 'other']),
  message: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  status: z.enum(['new', 'contacted', 'completed', 'archived']).optional()
});

// Blog Post validation
const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  slug: z.preprocess(
    (val) => {
      if (!val) return undefined;
      return val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    },
    z.string().optional()
  ),
  category: z.enum(['Care', 'Health', 'Adoption', 'Behavior', 'Nutrition', 'Training', 'Community', 'Success', 'Policy']).optional(),
  author: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  date: z.preprocess(
    (val) => {
      if (!val) return undefined;
      if (val instanceof Date) return val;
      if (typeof val === 'string') {
        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? undefined : parsed;
      }
      return val;
    },
    z.date().optional()
  ),
  readTime: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  image: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().optional()
  ),
  excerpt: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().trim().optional()
  ),
  content: z.string().min(1, 'Content is required').trim(),
  published: z.boolean().optional()
});

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  petSchema,
  adoptionSchema,
  surrenderSchema,
  bookingSchema,
  contactSchema,
  updateProfileSchema,
  adminUserUpdateSchema,
  statusUpdateSchema,
  successStorySchema,
  volunteerSchema,
  donationContactSchema,
  blogPostSchema
};

