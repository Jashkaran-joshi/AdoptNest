/**
 * Development Data Seeder
 * Generates realistic test data for MongoDB development database
 * 
 * Usage: node scripts/seed-dev-data.js
 * 
 * Environment Variables Required:
 * - MONGODB_URI_DEV: MongoDB connection string for development database
 * 
 * Configurable counts (defaults):
 * - users: 50
 * - pets: 100
 * - adoptionRequests: 25
 * - surrenders: 10
 * - bookings: 20
 * - stories: 15
 * - volunteers: 10
 * - donations: 60
 * - blogs: 12
 * - messages: 200
 * - analytics: 90 days of daily events
 */

// Load environment variables
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const envPath = path.join(__dirname, '..', '.env');
require('dotenv').config({ path: envPath });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../src/models/User');
const Pet = require('../src/models/Pet');
const Adoption = require('../src/models/Adoption');
const Surrender = require('../src/models/Surrender');
const Booking = require('../src/models/Booking');
const SuccessStory = require('../src/models/SuccessStory');
const Volunteer = require('../src/models/Volunteer');
const DonationContact = require('../src/models/DonationContact');
const BlogPost = require('../src/models/BlogPost');
const ContactMessage = require('../src/models/ContactMessage');

// Configuration - Exact counts as specified
const CONFIG = {
  adminUsers: 2, // Exactly 2 admin users (fixed)
  normalUsers: 25, // Exactly 25 normal users (fixed)
  pets: 100, // Exactly 100 pets (fixed)
  adoptionRequests: 25,
  surrenders: 10,
  bookings: 20,
  stories: 20, // Success stories (updated from 15)
  volunteers: 10,
  donations: 60,
  blogs: 50, // Updated from 12
  messages: 200,
  analyticsDays: 90
};

// SEED_VALUE for deterministic data generation
// Read from environment variable - can be changed anytime
const SEED_VALUE = process.env.SEED_VALUE || null;

// Simple seeded random number generator using SEED_VALUE
let seedState = null;
let seedCounter = 0;

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Initialize seed state
if (SEED_VALUE) {
  seedState = typeof SEED_VALUE === 'string' ? hashString(SEED_VALUE) : parseInt(SEED_VALUE);
  console.log(`🌱 Using SEED_VALUE: ${SEED_VALUE} (deterministic generation enabled)`);
  console.log(`   Change SEED_VALUE in .env to generate different data`);
} else {
  console.log(`🌱 No SEED_VALUE set - using truly random values`);
  console.log(`   Set SEED_VALUE in .env for reproducible test data`);
}

function seededRandom() {
  if (seedState === null) {
    return Math.random(); // Fallback to truly random
  }
  // Linear Congruential Generator
  seedState = (seedState * 1664525 + 1013904223) % Math.pow(2, 32);
  seedCounter++;
  return seedState / Math.pow(2, 32);
}

function seededRandomInt(min, max) {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}

function seededChoice(arr) {
  return arr[seededRandomInt(0, arr.length - 1)];
}

// Fake data generators
const firstNames = ['Aarav', 'Aditi', 'Ananya', 'Arjun', 'Diya', 'Ishaan', 'Kavya', 'Mohit', 'Neha', 'Priya', 'Rahul', 'Riya', 'Rohan', 'Sneha', 'Vikram', 'Aanya', 'Dev', 'Kiran', 'Meera', 'Nikhil', 'Pooja', 'Raj', 'Sanjay', 'Shreya', 'Vivek', 'Anjali', 'Deepak', 'Kavita', 'Manish', 'Nisha', 'Ravi', 'Sonia', 'Tarun', 'Uma', 'Yash', 'Zara', 'Aman', 'Bhavna', 'Chandan', 'Divya', 'Esha', 'Farhan', 'Gita', 'Harsh', 'Indira', 'Jay', 'Komal', 'Lakshmi', 'Manoj', 'Nidhi'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Verma', 'Reddy', 'Mehta', 'Jain', 'Shah', 'Agarwal', 'Malhotra', 'Nair', 'Rao', 'Iyer', 'Menon', 'Pillai', 'Nair', 'Krishnan', 'Sundaram', 'Desai', 'Joshi', 'Kapoor', 'Bansal', 'Arora', 'Chopra', 'Dutta', 'Ganguly', 'Hegde', 'Iyengar', 'Kulkarni', 'Lal', 'Mishra', 'Narayan', 'Ojha', 'Pandey', 'Qureshi', 'Rastogi', 'Saxena', 'Tiwari', 'Upadhyay', 'Vaidya', 'Wadhwa', 'Yadav', 'Zaveri', 'Acharya', 'Bhatt', 'Chauhan', 'Dwivedi', 'Eswaran'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad'];
const petNames = ['Max', 'Bella', 'Charlie', 'Luna', 'Cooper', 'Daisy', 'Rocky', 'Molly', 'Buddy', 'Lucy', 'Jack', 'Sadie', 'Toby', 'Maggie', 'Bear', 'Sophie', 'Duke', 'Stella', 'Zeus', 'Penny', 'Oscar', 'Lily', 'Milo', 'Chloe', 'Teddy', 'Ruby', 'Leo', 'Zoey', 'Jax', 'Lola', 'Finn', 'Nala', 'Rex', 'Maya', 'Gus', 'Willow', 'Jake', 'Coco', 'Sam', 'Rosie', 'Bentley', 'Mia', 'Harley', 'Ellie', 'Murphy', 'Piper', 'Oliver', 'Layla', 'Tucker', 'Zoe'];
const dogBreeds = ['Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Bulldog', 'Beagle', 'Poodle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dachshund', 'Siberian Husky', 'Great Dane', 'Doberman', 'Shih Tzu', 'Chihuahua', 'Border Collie', 'Australian Shepherd', 'Cocker Spaniel', 'Pomeranian', 'Maltese'];
const catBreeds = ['Persian', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Bengal', 'Siamese', 'American Shorthair', 'Abyssinian', 'Russian Blue', 'Scottish Fold', 'Sphynx', 'Norwegian Forest', 'Turkish Angora', 'Birman', 'Oriental', 'Exotic Shorthair', 'Devon Rex', 'Himalayan', 'Manx', 'Chartreux'];
const birdBreeds = ['Parakeet', 'Cockatiel', 'Canary', 'Finch', 'Lovebird', 'Budgerigar', 'Cockatoo', 'Macaw', 'African Grey', 'Conure'];
const rabbitBreeds = ['Holland Lop', 'Mini Rex', 'Netherland Dwarf', 'Lionhead', 'Angora', 'Flemish Giant', 'English Spot', 'French Lop', 'Californian', 'New Zealand'];
const services = ['Grooming', 'Vet / Doctor', 'Boarding (per night)', 'Daycare (per day)', 'Training Session'];
const donationPurposes = ['general', 'sponsor-pet', 'monthly-support', 'one-time', 'other'];
const blogCategories = ['Care', 'Health', 'Adoption', 'Behavior', 'Nutrition', 'Training', 'Community', 'Success', 'Policy'];
const petStatuses = ['Available', 'Adopted', 'Pending'];
const adoptionStatuses = ['Pending', 'Approved', 'Rejected', 'Cancelled'];
const surrenderStatuses = ['Pending', 'Received', 'Rejected'];
const bookingStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Change Requested'];
const volunteerStatuses = ['Pending', 'Approved', 'Rejected'];
const donationStatuses = ['new', 'contacted', 'completed', 'archived'];
const messageStatuses = ['unread', 'read', 'replied'];

// Helper functions - use seeded RNG if SEED_VALUE is set, otherwise use Math.random()
const random = (arr) => SEED_VALUE ? seededChoice(arr) : arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => SEED_VALUE ? seededRandomInt(min, max) : Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (daysAgo = 0, daysRange = 90) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo - randomInt(0, daysRange));
  return date;
};
const randomTime = () => {
  const hours = randomInt(9, 18);
  const minutes = random([0, 15, 30, 45]);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Image download utilities (for fallback only)
const imageManager = require('../src/utils/imageManager');
const { ensureUploadDirectories, generateFilename, getImageUrl, baseUploadDir, UPLOAD_CATEGORIES } = imageManager;

// jsDelivr CDN service for generating image URLs
const { getJsDelivrUrl } = require('../src/services/jsdelivrService');
const { uploadFileToGitHub, uploadMultipleFiles, validateGitHubToken } = require('../src/services/githubService');

// Check if jsDelivr is configured
const config = require('../src/config');
const JSDELIVR_CONFIGURED = !!(config.jsdelivr.githubOwner && config.jsdelivr.githubRepo && config.jsdelivr.githubBranch);
const GITHUB_AUTO_UPLOAD = process.env.GITHUB_AUTO_UPLOAD === 'true' && !!process.env.GITHUB_TOKEN;

if (JSDELIVR_CONFIGURED) {
  console.log('✅ jsDelivr configured - images will use jsDelivr CDN URLs');
  console.log(`   GitHub: ${config.jsdelivr.githubOwner}/${config.jsdelivr.githubRepo}@${config.jsdelivr.githubBranch}`);
  if (GITHUB_AUTO_UPLOAD) {
    console.log('✅ GitHub auto-upload enabled - images will be uploaded automatically');
  } else {
    console.log('ℹ️  GitHub auto-upload disabled - set GITHUB_AUTO_UPLOAD=true and GITHUB_TOKEN to enable');
    console.log('   Images must be uploaded to your GitHub repository manually');
  }
} else {
  console.log('⚠️  jsDelivr not configured - will use placeholder URLs');
  console.log('   Set GITHUB_REPO_OWNER, GITHUB_REPO_NAME, and GITHUB_REPO_BRANCH to enable jsDelivr CDN URLs');
  console.log('   Images must be uploaded to your GitHub repository manually');
}

/**
 * Upload image to GitHub and return jsDelivr CDN URL
 * @param {string} imageUrl - Placeholder image URL to download
 * @param {string} repoPath - Path where image should be stored in repo (e.g., 'pets/pet-1.jpg')
 * @param {string} category - Category folder (pets, users, stories, blog, etc.)
 * @returns {Promise<string>} jsDelivr CDN URL
 */
async function uploadImageToGitHubAndGetUrl(imageUrl, repoPath, category) {
  if (!GITHUB_AUTO_UPLOAD) {
    // Auto-upload disabled, just generate URL (assuming file exists)
    return getImageUrlForSeed(repoPath, category);
  }

  try {
    // Download image from placeholder URL
    console.log(`  📥 Downloading image for ${repoPath}...`);
    const imageBuffer = await downloadImageAsBuffer(imageUrl);
    
    // Upload to GitHub
    console.log(`  📤 Uploading ${repoPath} to GitHub...`);
    await uploadFileToGitHub(
      repoPath,
      imageBuffer,
      `Add ${category} image: ${repoPath.split('/').pop()}`
    );
    
    // Generate jsDelivr URL
    const cdnUrl = getJsDelivrUrl(repoPath, category);
    console.log(`  ✅ Uploaded and generated URL: ${cdnUrl}`);
    return cdnUrl;
  } catch (error) {
    console.warn(`  ⚠️  Failed to upload ${repoPath}: ${error.message}`);
    // Fallback: try to generate URL anyway (file might already exist)
    try {
      return getImageUrlForSeed(repoPath, category);
    } catch (e) {
      return getPlaceholderImageUrl(category, 800, 600, 0);
    }
  }
}

/**
 * Generate jsDelivr CDN URL for an image
 * Images must be uploaded to GitHub repository manually (unless auto-upload is enabled)
 * @param {string} imagePath - Path to image in GitHub repo (e.g., 'pets/dog.jpg')
 * @param {string} category - Category folder (pets, users, stories, blog, etc.)
 * @param {string} originalName - Original filename (for reference)
 * @returns {string} jsDelivr CDN URL or placeholder URL
 */
function getImageUrlForSeed(imagePath, category, originalName = 'image.jpg') {
  // If it's already a full URL, return as-is
  if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
    return imagePath;
  }
  
  // If jsDelivr is configured, generate CDN URL
  if (JSDELIVR_CONFIGURED) {
    try {
      const cdnUrl = getJsDelivrUrl(imagePath, category);
      return cdnUrl;
    } catch (error) {
      // Fallback to placeholder
    }
  }
  
  // Fallback: use placeholder URL
  return getPlaceholderImageUrl(category, 800, 600, 0);
}

/**
 * Download image from URL and return as Buffer (for GitHub upload)
 * @param {string} imageUrl - URL of the image to download
 * @returns {Promise<Buffer>} Image data as Buffer
 */
async function downloadImageAsBuffer(imageUrl) {
  return new Promise((resolve, reject) => {
    try {
      const client = imageUrl.startsWith('https:') ? https : http;
      const chunks = [];
      
      const request = client.get(imageUrl, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          return downloadImageAsBuffer(response.headers.location)
            .then(resolve)
            .catch(reject);
        }
        
        if (response.statusCode !== 200) {
          return reject(new Error(`Failed to download image: ${response.statusCode}`));
        }
        
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        response.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        
        response.on('error', (err) => {
          reject(err);
        });
      });
      
      request.on('error', (err) => {
        reject(err);
      });
      
      request.setTimeout(15000, () => {
        request.destroy();
        reject(new Error('Download timeout'));
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Download image from URL and save to local directory (fallback only)
 * @param {string} imageUrl - URL of the image to download
 * @param {string} category - Category folder (pets, users, stories, blog, etc.)
 * @param {string} originalName - Original filename for extension detection
 * @returns {Promise<string>} Local file path
 */
async function downloadImage(imageUrl, category, originalName = 'image.jpg') {
  return new Promise((resolve, reject) => {
    try {
      const categoryDir = UPLOAD_CATEGORIES[category] || UPLOAD_CATEGORIES.general;
      const uploadDir = path.join(baseUploadDir, categoryDir);
      
      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Generate filename
      const ext = path.extname(originalName) || '.jpg';
      const filename = generateFilename(category, `seed-${Date.now()}-${randomInt(1000, 9999)}${ext}`);
      const filePath = path.join(uploadDir, filename);
      
      const client = imageUrl.startsWith('https:') ? https : http;
      
      const file = fs.createWriteStream(filePath);
      
      const request = client.get(imageUrl, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          return downloadImage(response.headers.location, category, originalName)
            .then(resolve)
            .catch(reject);
        }
        
        if (response.statusCode !== 200) {
          file.close();
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          return reject(new Error(`Failed to download image: ${response.statusCode}`));
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          const imagePath = getImageUrl(category, filename);
          resolve(imagePath);
        });
        
        file.on('error', (err) => {
          file.close();
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          reject(err);
        });
      });
      
      request.on('error', (err) => {
        file.close();
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        reject(err);
      });
      
      request.setTimeout(10000, () => {
        request.destroy();
        file.close();
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        reject(new Error('Download timeout'));
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get demo image URL
 * Uses placeholder services for seeding
 */
function getDemoImageUrl(category, width = 800, height = 600, index = 0) {
  // Different image IDs for different categories to get appropriate images
  const categoryImages = {
    pets: [
      'xBRQfR2bqNI', 'vHnVtLK8rCc', 'J6449eJ4VSw', 'yMSecCHsIBc', '6P9O6fkXN3s',
      'fJTk8wI9hF4', 'X7UR8zFHfyw', 'pFyKRmDiW1M', '8bghKxNU1j0', 'FJSBpTNjXWU'
    ],
    users: [
      'mEZ3PoFGs_k', 'PIP0jdK7nYA', '8xSmPC44vFU', 'rDEOVtE7vOs', 'iEEBWgY_6lA',
      'n4KewLKFOZw', 'pAtA8xe_iVM', 'd1UPkiFd04A', '4_yh2DKELEw', 'r7WXJKOjS8w'
    ],
    stories: [
      'xBRQfR2bqNI', 'vHnVtLK8rCc', 'J6449eJ4VSw', 'yMSecCHsIBc', '6P9O6fkXN3s',
      'fJTk8wI9hF4', 'X7UR8zFHfyw', 'pFyKRmDiW1M', '8bghKxNU1j0', 'FJSBpTNjXWU'
    ],
    blog: [
      'HwBAsSbE-D4', 'rDEOVtE7vOs', 'iEEBWgY_6lA', 'n4KewLKFOZw', 'pAtA8xe_iVM',
      'd1UPkiFd04A', '4_yh2DKELEw', 'r7WXJKOjS8w', 'mEZ3PoFGs_k', 'PIP0jdK7nYA'
    ],
    surrenders: [
      'xBRQfR2bqNI', 'vHnVtLK8rCc', 'J6449eJ4VSw', 'yMSecCHsIBc', '6P9O6fkXN3s',
      'fJTk8wI9hF4', 'X7UR8zFHfyw', 'pFyKRmDiW1M', '8bghKxNU1j0', 'FJSBpTNjXWU'
    ],
    general: [
      'HwBAsSbE-D4', 'rDEOVtE7vOs', 'iEEBWgY_6lA', 'n4KewLKFOZw', 'pAtA8xe_iVM',
      'd1UPkiFd04A', '4_yh2DKELEw', 'r7WXJKOjS8w', 'mEZ3PoFGs_k', 'PIP0jdK7nYA'
    ]
  };
  
  const images = categoryImages[category] || categoryImages.general;
  const imageIndex = index % images.length;
  const imageId = images[imageIndex];
  
  // Use Unsplash Source API (free, no key required)
  // For seeding, we'll use placeholder service that provides reliable images
  return `https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
}

/**
 * Get placeholder image URL for seeding
 * Returns a reliable placeholder image URL for Firebase Storage uploads
 */
function getPlaceholderImageUrl(category, width = 800, height = 600, index = 0) {
  // Use a reliable placeholder service - Picsum with seed for consistency
  const categorySeeds = {
    pets: [237, 593, 659, 718, 237, 593, 659, 718, 237, 593],
    users: [64, 237, 354, 433, 475, 64, 237, 354, 433, 475],
    stories: [237, 593, 659, 718, 237, 593, 659, 718, 237, 593],
    blog: [237, 354, 433, 475, 593, 237, 354, 433, 475, 593],
    surrenders: [237, 593, 659, 718, 237, 593, 659, 718, 237, 593],
    general: [1, 237, 354, 433, 475, 593, 659, 718, 1, 237]
  };
  
  const seeds = categorySeeds[category] || categorySeeds.general;
  const seedIndex = index % seeds.length;
  const imageSeed = seeds[seedIndex] + (index * 10);
  
  // For Firebase Storage integration, we'll use a placeholder service
  // In production, these will be uploaded to Firebase Storage
  // For now, use Picsum which provides reliable placeholder images
  
  // Using a simple placeholder that works everywhere
  return `https://picsum.photos/seed/${imageSeed}/${width}/${height}`;
}

/**
 * Get breed-specific image URL for pets
 * Uses breed-appropriate placeholder images
 */
function getBreedImageUrl(breed, type, index = 0) {
  // Map breeds to specific image seeds for consistency
  const breedImageSeeds = {
    // Dogs
    'Labrador Retriever': [203, 205, 207, 209],
    'Golden Retriever': [211, 213, 215, 217],
    'German Shepherd': [301, 303, 305, 307],
    'Bulldog': [401, 403, 405, 407],
    'Beagle': [501, 503, 505, 507],
    'Poodle': [601, 603, 605, 607],
    'Rottweiler': [701, 703, 705, 707],
    'Yorkshire Terrier': [801, 803, 805, 807],
    'Boxer': [901, 903, 905, 907],
    'Dachshund': [1001, 1003, 1005, 1007],
    'Siberian Husky': [1101, 1103, 1105, 1107],
    'Great Dane': [1201, 1203, 1205, 1207],
    'Doberman': [1301, 1303, 1305, 1307],
    'Shih Tzu': [1401, 1403, 1405, 1407],
    'Chihuahua': [1501, 1503, 1505, 1507],
    'Border Collie': [1601, 1603, 1605, 1607],
    'Australian Shepherd': [1701, 1703, 1705, 1707],
    'Cocker Spaniel': [1801, 1803, 1805, 1807],
    'Pomeranian': [1901, 1903, 1905, 1907],
    'Maltese': [2001, 2003, 2005, 2007],
    // Cats
    'Persian': [2101, 2103, 2105, 2107],
    'Maine Coon': [2201, 2203, 2205, 2207],
    'British Shorthair': [2301, 2303, 2305, 2307],
    'Ragdoll': [2401, 2403, 2405, 2407],
    'Bengal': [2501, 2503, 2505, 2507],
    'Siamese': [2601, 2603, 2605, 2607],
    'American Shorthair': [2701, 2703, 2705, 2707],
    'Abyssinian': [2801, 2803, 2805, 2807],
    'Russian Blue': [2901, 2903, 2905, 2907],
    'Scottish Fold': [3001, 3003, 3005, 3007],
    'Sphynx': [3101, 3103, 3105, 3107],
    'Norwegian Forest': [3201, 3203, 3205, 3207],
    'Turkish Angora': [3301, 3303, 3305, 3307],
    'Birman': [3401, 3403, 3405, 3407],
    'Oriental': [3501, 3503, 3505, 3507],
    'Exotic Shorthair': [3601, 3603, 3605, 3607],
    'Devon Rex': [3701, 3703, 3705, 3707],
    'Himalayan': [3801, 3803, 3805, 3807],
    'Manx': [3901, 3903, 3905, 3907],
    'Chartreux': [4001, 4003, 4005, 4007],
    // Birds
    'Parakeet': [5001, 5003, 5005, 5007],
    'Cockatiel': [5101, 5103, 5105, 5107],
    'Canary': [5201, 5203, 5205, 5207],
    'Finch': [5301, 5303, 5305, 5307],
    'Lovebird': [5401, 5403, 5405, 5407],
    'Budgerigar': [5501, 5503, 5505, 5507],
    'Cockatoo': [5601, 5603, 5605, 5607],
    'Macaw': [5701, 5703, 5705, 5707],
    'African Grey': [5801, 5803, 5805, 5807],
    'Conure': [5901, 5903, 5905, 5907],
    // Rabbits
    'Holland Lop': [6001, 6003, 6005, 6007],
    'Mini Rex': [6101, 6103, 6105, 6107],
    'Netherland Dwarf': [6201, 6203, 6205, 6207],
    'Lionhead': [6301, 6303, 6305, 6307],
    'Angora': [6401, 6403, 6405, 6407],
    'Flemish Giant': [6501, 6503, 6505, 6507],
    'English Spot': [6601, 6603, 6605, 6607],
    'French Lop': [6701, 6703, 6705, 6707],
    'Californian': [6801, 6803, 6805, 6807],
    'New Zealand': [6901, 6903, 6905, 6907]
  };
  
  // Get seed for this breed or use default
  const seeds = breedImageSeeds[breed] || [100 + index, 200 + index, 300 + index];
  const seedIndex = index % seeds.length;
  const imageSeed = seeds[seedIndex];
  
  // Use placeholder service with breed-specific seed
  return `https://picsum.photos/seed/${imageSeed}/800/600`;
}

/**
 * Get seed image URL for seeding
 * Returns placeholder URL that will be uploaded to jsDelivr CDN during seeding
 */
function getSeedImageUrl(category, index = 0) {
  // Return placeholder URL - it will be uploaded to GitHub during seeding
  const placeholderUrl = getPlaceholderImageUrl(category, 800, 600, index);
  return placeholderUrl;
}


// Generate fake data
async function generateUsers() {
  const users = [];
  
  // Create exactly 2 admin users with specified credentials
  console.log(`Creating ${CONFIG.adminUsers} admin users...`);
  const admin1Password = await bcrypt.hash('123456', 10);
  const admin2Password = await bcrypt.hash('admin@123', 10);
  
  users.push({
    name: 'Jashkaran Joshi',
    email: 'Jashkaranjoshi@gmail.com',
    password: admin1Password,
    phone: `+91${randomInt(7000000000, 9999999999)}`,
    city: random(cities),
    role: 'admin',
    isEmailVerified: true,
    status: 'active',
    createdAt: randomDate(0, 180),
    updatedAt: randomDate(0, 180)
  });
  
  users.push({
    name: 'Admin User',
    email: 'Admin@gmail.com',
    password: admin2Password,
    phone: `+91${randomInt(7000000000, 9999999999)}`,
    city: random(cities),
    role: 'admin',
    isEmailVerified: true,
    status: 'active',
    createdAt: randomDate(0, 180),
    updatedAt: randomDate(0, 180)
  });
  
  // Create exactly 25 normal users with password "user@123"
  console.log(`Generating ${CONFIG.normalUsers} normal users...`);
  const userPassword = await bcrypt.hash('user@123', 10);
  
  // Create unique combinations for users
  const usedNames = new Set();
  for (let i = 0; i < CONFIG.normalUsers; i++) {
    let firstName, lastName, email;
    let attempts = 0;
    
    // Ensure unique names and emails
    do {
      firstName = random(firstNames);
      lastName = random(lastNames);
      email = `${firstName.toLowerCase()}${lastName.toLowerCase()}${i + 1}@gmail.com`;
      attempts++;
    } while (usedNames.has(email) && attempts < 100);
    
    usedNames.add(email);
    
    users.push({
      name: `${firstName} ${lastName}`,
      email: email,
      password: userPassword,
      phone: `+91${randomInt(7000000000, 9999999999)}`,
      city: random(cities),
      role: 'user',
      isEmailVerified: seededRandom() > 0.2, // 80% verified
      status: seededRandom() > 0.1 ? 'active' : 'suspended', // 90% active
      createdAt: randomDate(0, 180),
      updatedAt: randomDate(0, 180)
    });
  }
  
  console.log(`✅ Generated ${users.length} users (${CONFIG.adminUsers} admins, ${CONFIG.normalUsers} normal users)`);
  return users;
}

async function generatePets(users, downloadedImages = {}) {
  console.log(`Generating ${CONFIG.pets} pets...`);
  const pets = [];
  const types = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];
  const ageGroups = ['Young', 'Adult', 'Senior'];
  const genders = ['Male', 'Female'];
  
  if (!users || users.length === 0) {
    throw new Error('Users array is required and must not be empty');
  }
  
  // Generate or upload pet images
  if (GITHUB_AUTO_UPLOAD) {
    console.log('  Uploading pet images to GitHub and generating jsDelivr URLs...');
  } else if (JSDELIVR_CONFIGURED) {
    console.log('  Generating jsDelivr CDN URLs for pet images...');
  } else {
    console.log('  Using placeholder URLs for pet images...');
  }
  
  const petImages = [];
  for (let i = 0; i < CONFIG.pets; i++) {
    try {
      const repoPath = `pets/pet-${i + 1}.jpg`;
      const placeholderUrl = getPlaceholderImageUrl('pets', 800, 600, i);
      
      let imageUrl;
      if (GITHUB_AUTO_UPLOAD) {
        // Download placeholder, upload to GitHub, get jsDelivr URL
        imageUrl = await uploadImageToGitHubAndGetUrl(placeholderUrl, repoPath, 'pets');
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } else {
        // Just generate URL (assumes file exists in repo)
        imageUrl = getImageUrlForSeed(repoPath, 'pets', `pet-${i + 1}.jpg`);
      }
      
      petImages.push(imageUrl);
      if (i % 10 === 0) {
        if (GITHUB_AUTO_UPLOAD) {
          console.log(`    Uploaded ${i + 1}/${CONFIG.pets} images to GitHub...`);
        } else if (JSDELIVR_CONFIGURED) {
          console.log(`    Generated ${i + 1}/${CONFIG.pets} jsDelivr URLs...`);
        }
      }
    } catch (error) {
      console.warn(`  Warning: Could not process pet image ${i + 1}: ${error.message}`);
      // Fallback to placeholder URL
      petImages.push(getPlaceholderImageUrl('pets', 800, 600, i));
    }
  }
  
  for (let i = 0; i < CONFIG.pets; i++) {
    const type = random(types);
    let breed = '';
    if (type === 'Dog') breed = random(dogBreeds);
    else if (type === 'Cat') breed = random(catBreeds);
    else if (type === 'Bird') breed = random(birdBreeds);
    else if (type === 'Rabbit') breed = random(rabbitBreeds);
    
    const age = randomInt(0, 15);
    let ageGroup = 'Adult';
    if (age < 2) ageGroup = 'Young';
    else if (age > 8) ageGroup = 'Senior';
    
    const status = random(petStatuses);
    const randomUser = random(users);
    const createdBy = randomUser._id || randomUser.id;
    
    const petName = random(petNames);
    const petType = type;
    
    // Ensure required fields are set
    if (!petName || !petType) {
      console.error(`Error generating pet ${i + 1}: name=${petName}, type=${petType}`);
      continue;
    }
    
    // Get breed-appropriate image
    let petImage = petImages[i] || getBreedImageUrl(breed, type, i);
    
    // If breed-specific image generation is available, use it
    if (breed && !petImages[i]) {
      petImage = getBreedImageUrl(breed, type, i);
    }
    
    // Create Indian-context appropriate descriptions
    const descriptions = {
      Dog: `A beautiful ${breed || 'dog'} looking for a loving home in ${random(cities)}. ${breed ? `This ${breed} is` : 'He/She is'} very friendly, well-behaved, and great with families. Perfect companion for Indian households. Ready for adoption!`,
      Cat: `A lovely ${breed || 'cat'} available for adoption in ${random(cities)}. ${breed ? `This ${breed} is` : 'He/She is'} independent yet affectionate, ideal for Indian homes. Very playful and loves attention.`,
      Bird: `A beautiful ${breed || 'bird'} looking for a caring owner in ${random(cities)}. ${breed ? `This ${breed} is` : 'He/She is'} healthy, active, and loves to interact. Perfect for bird lovers.`,
      Rabbit: `An adorable ${breed || 'rabbit'} available for adoption in ${random(cities)}. ${breed ? `This ${breed} is` : 'He/She is'} gentle, friendly, and perfect for families. Very easy to care for.`,
      Other: `A unique pet looking for a forever home in ${random(cities)}. Very friendly and perfect for Indian households.`
    };
    
    pets.push({
      name: petName,
      type: petType,
      breed: breed || undefined,
      age: age || undefined,
      ageGroup: ageGroup,
      gender: random(genders),
      location: random(cities),
      // Use breed-specific image
      image: petImage,
      description: descriptions[type] || `A lovely ${type.toLowerCase()} looking for a forever home in ${random(cities)}.`,
      status: status,
      featured: seededRandom() > 0.7, // 30% featured
      createdBy: createdBy,
      createdAt: randomDate(0, 120),
      updatedAt: randomDate(0, 120)
    });
  }
  
  return pets;
}

function generateAdoptionRequests(users, pets) {
  console.log(`Generating ${CONFIG.adoptionRequests} adoption requests...`);
  const requests = [];
  const availablePets = pets.filter(p => p.status === 'Available' || p.status === 'Pending');
  
  for (let i = 0; i < CONFIG.adoptionRequests && i < availablePets.length; i++) {
    const user = random(users);
    const pet = availablePets[i % availablePets.length];
    
    requests.push({
      petId: pet._id,
      applicantId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || `+91${randomInt(7000000000, 9999999999)}`,
      address: `${randomInt(1, 999)} ${random(['MG Road', 'Park Avenue', 'Gandhi Road', 'Nehru Nagar', 'Sector', 'Ward', 'Colony'])}, ${user.city || random(cities)}, ${random(['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'West Bengal', 'Rajasthan'])}`,
      city: user.city || random(cities),
      experience: random([
        'Yes, I have had pets before in my Indian home',
        'No, this will be my first pet',
        'I have experience with dogs in Indian climate',
        'I have experience with cats and Indian family settings',
        'I grew up with pets in our joint family',
        'I have fostered animals before'
      ]),
      reason: random([
        'Looking for a companion for our family',
        'My children want a pet',
        'Previous pet passed away and we want to adopt again',
        'Want to give a rescued pet a loving Indian home',
        'Love animals and want to contribute to rescue efforts',
        'Moving to a bigger apartment and can now have a pet',
        'Want to adopt a street dog and give it a home'
      ]),
      otherPets: seededRandom() > 0.5,
      otherPetsDetails: seededRandom() > 0.5 ? `I have ${randomInt(1, 3)} ${random(['dog', 'cat'])}${randomInt(1, 3) > 1 ? 's' : ''} at home` : undefined,
      homeType: random(['apartment', 'house', 'condo', 'other']),
      yard: seededRandom() > 0.4,
      hoursAlone: random(['0-2 hours', '2-4 hours', '4-6 hours', '6-8 hours', '8+ hours']),
      references: seededRandom() > 0.3 ? `Reference: ${random(firstNames)} ${random(lastNames)}, Phone: +91${randomInt(7000000000, 9999999999)}` : undefined,
      status: random(adoptionStatuses),
      createdAt: randomDate(0, 60),
      updatedAt: randomDate(0, 60)
    });
  }
  
  return requests;
}

function generateSurrenders(users) {
  console.log(`Generating ${CONFIG.surrenders} surrenders...`);
  const surrenders = [];
  const types = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];
  const reasons = [
    'Moving to a new city in India for job',
    'Financial difficulties due to job loss',
    'Family member developed allergies',
    'No time to care due to work commitments',
    'Family situation changed - moving to smaller apartment',
    'Pet needs better care than we can provide',
    'Relocating abroad for work',
    'Unable to care due to health issues',
    'Moving to a pet-restricted housing society',
    'Elderly parent unable to care for pet anymore'
  ];
  
  for (let i = 0; i < CONFIG.surrenders; i++) {
    const user = random(users);
    const type = random(types);
    
    surrenders.push({
      name: random(petNames),
      type: type,
      age: randomInt(0, 12),
      reason: random(reasons),
      // Use placeholder image URL (in production, replace with Firebase Storage URLs)
      image: getSeedImageUrl('surrenders', i),
      contact: user.email,
      phone: user.phone || `+91${randomInt(7000000000, 9999999999)}`,
      submittedBy: user._id,
      status: random(surrenderStatuses),
      createdAt: randomDate(0, 90),
      updatedAt: randomDate(0, 90)
    });
  }
  
  return surrenders;
}

function generateBookings(users, pets) {
  console.log(`Generating ${CONFIG.bookings} bookings...`);
  const bookings = [];
  const servicePrices = {
    'Grooming': 500,
    'Vet / Doctor': 1500,
    'Boarding (per night)': 800,
    'Daycare (per day)': 600,
    'Training Session': 2000
  };
  
  for (let i = 0; i < CONFIG.bookings; i++) {
    const user = random(users);
    const service = random(services);
    const qty = randomInt(1, 3);
    const amount = servicePrices[service] * qty;
    const date = randomDate(0, 30); // Future dates
    
    bookings.push({
      userId: user._id,
      petId: seededRandom() > 0.3 ? random(pets)._id : undefined, // 70% have pet
      name: user.name,
      email: user.email,
      phone: user.phone || `+91${randomInt(7000000000, 9999999999)}`,
      service: service,
      date: date,
      time: randomTime(),
      qty: qty,
      notes: seededRandom() > 0.5 ? random([
        'Please be gentle with my pet',
        'First time visit - my pet might be nervous',
        'Special dietary requirements - Indian vegetarian diet preferred',
        'Vaccination needed before boarding',
        'My pet is scared of loud noises (Diwali season)',
        'Prefer Indian veterinarian if possible',
        'Pet needs air conditioning during service'
      ]) : undefined,
      amount: amount,
      status: random(bookingStatuses),
      createdAt: randomDate(0, 45),
      updatedAt: randomDate(0, 45)
    });
  }
  
  return bookings;
}

async function generateStories(pets) {
  console.log(`Generating ${CONFIG.stories} success stories...`);
  const stories = [];
  const adoptedPets = pets.filter(p => p.status === 'Adopted').slice(0, CONFIG.stories);
  const types = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];
  // Indian-context success story templates
  const storyTemplates = [
    `We adopted {petName} from AdoptNest and it was the best decision our family has ever made. Living in {city}, we were looking for a companion for our children. {petName} has brought so much joy and laughter to our Indian household. Despite initial concerns about adopting a rescue pet, {petName} adapted beautifully to our home and family traditions.`,
    `{petName} came into our lives at the perfect time. The AdoptNest team did an amazing job preparing {petName} for adoption, especially helping us understand how to care for a pet in the Indian climate. From the first day, {petName} felt like part of our family in {city}. Our neighbors and extended family have all fallen in love with {petName}.`,
    `Our journey with {petName} has been incredible. We found {petName} through AdoptNest and couldn't be happier. Living in an apartment in {city}, we were worried about space, but {petName} has proven that love matters more than space. From celebrating Indian festivals together to simple evening walks, {petName} has enriched our lives in ways we never imagined.`,
    `Adopting {petName} changed our lives completely. As a working couple in {city}, we thought we didn't have time for a pet. But {petName} has brought so much love and companionship that we can't imagine life without them. The AdoptNest team made the adoption process smooth and provided excellent support. {petName} has become the heart of our family.`,
    `{petName} is the most loving pet we could have asked for. Thank you AdoptNest for bringing us together. We adopted {petName} six months ago here in {city}, and it's been the most wonderful experience. {petName} has adapted to Indian food (pet food, of course!), our family's busy schedule, and even enjoys our traditional festivals. The joy {petName} brings to our household is immeasurable.`,
    `When we decided to adopt from AdoptNest, we had many questions about caring for a pet in India. The team was patient and helpful throughout the process. {petName} has been with us in {city} for almost a year now, and the bond we share is incredible. Our children have learned responsibility and compassion through caring for {petName}. This adoption has truly been a blessing for our family.`,
    `As first-time pet owners in {city}, we were nervous about adopting. But AdoptNest made everything easy and provided wonderful guidance. {petName} has been the perfect addition to our family. We love watching {petName} play in our apartment balcony, go for walks in the neighborhood, and just be part of our daily lives. Adopting {petName} was one of the best decisions we've made.`,
    `We adopted {petName} thinking we were saving a life, but {petName} has saved us in so many ways. Living in busy {city}, life can be stressful, but {petName} brings calm and joy to our home. The unconditional love and loyalty {petName} shows us every day is amazing. AdoptNest helped us find the perfect match, and we're forever grateful for this wonderful pet in our lives.`
  ];
  
  // Generate or upload story images
  if (GITHUB_AUTO_UPLOAD) {
    console.log('  Uploading story images to GitHub and generating jsDelivr URLs...');
  } else if (JSDELIVR_CONFIGURED) {
    console.log('  Generating jsDelivr CDN URLs for story images...');
  } else {
    console.log('  Using placeholder URLs for story images...');
  }
  
  const storyImages = [];
  for (let i = 0; i < CONFIG.stories; i++) {
    try {
      const repoPath = `stories/story-${i + 1}.jpg`;
      const placeholderUrl = getPlaceholderImageUrl('stories', 800, 600, i);
      
      let imageUrl;
      if (GITHUB_AUTO_UPLOAD) {
        imageUrl = await uploadImageToGitHubAndGetUrl(placeholderUrl, repoPath, 'stories');
        await new Promise(resolve => setTimeout(resolve, 200));
      } else {
        imageUrl = getImageUrlForSeed(repoPath, 'stories', `story-${i + 1}.jpg`);
      }
      
      storyImages.push(imageUrl);
    } catch (error) {
      console.warn(`  Warning: Could not process story image ${i + 1}: ${error.message}`);
      storyImages.push(getPlaceholderImageUrl('stories', 800, 600, i));
    }
  }
  
  for (let i = 0; i < CONFIG.stories; i++) {
    const pet = adoptedPets[i] || { name: random(petNames), type: random(types) };
    const adopterName = `${random(firstNames)} ${random(lastNames)}`;
    const city = random(cities);
    // Replace placeholders in story template with pet name and city
    let story = random(storyTemplates).replace(/{petName}/g, pet.name);
    story = story.replace(/{city}/g, city);
    
    stories.push({
      petName: pet.name,
      petType: pet.type || random(types),
      adopterName: adopterName,
      location: city,
      story: story,
      // Use jsDelivr CDN URL or placeholder URL
      image: storyImages[i] || getSeedImageUrl('stories', i),
      adoptedDate: randomDate(0, 180),
      rating: randomInt(4, 5),
      published: seededRandom() > 0.1, // 90% published
      createdAt: randomDate(0, 150),
      updatedAt: randomDate(0, 150)
    });
  }
  
  return stories;
}

function generateVolunteers() {
  console.log(`Generating ${CONFIG.volunteers} volunteers...`);
  const volunteers = [];
  const types = ['volunteer', 'foster'];
  const availabilities = ['Weekends only', 'Weekdays', 'Flexible', 'Evenings', 'Mornings', 'Full time'];
  const experiences = ['5+ years with pets', 'First time', 'Previous volunteer experience', 'Pet owner for 10+ years', 'Veterinary background'];
  const whys = ['Love animals', 'Want to give back', 'Have time to help', 'Passionate about animal welfare', 'Want to make a difference'];
  
  for (let i = 0; i < CONFIG.volunteers; i++) {
    const firstName = random(firstNames);
    const lastName = random(lastNames);
    const email = `volunteer.${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    
    volunteers.push({
      name: `${firstName} ${lastName}`,
      email: email,
      phone: `+91${randomInt(7000000000, 9999999999)}`,
      city: random(cities),
      type: random(types),
      availability: random(availabilities),
      experience: random(experiences),
      why: random(whys),
      status: random(volunteerStatuses),
      createdAt: randomDate(0, 90),
      updatedAt: randomDate(0, 90)
    });
  }
  
  return volunteers;
}

function generateDonations(users) {
  console.log(`Generating ${CONFIG.donations} donation contacts...`);
  const donations = [];
  
  for (let i = 0; i < CONFIG.donations; i++) {
    const hasUser = seededRandom() > 0.4; // 60% from logged-in users
    const user = hasUser ? random(users) : null;
    const firstName = user ? user.name.split(' ')[0] : random(firstNames);
    const lastName = user ? user.name.split(' ')[1] : random(lastNames);
    const email = user ? user.email : `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    
    const messages = [
      'Would like to support your mission',
      'Interested in monthly donations',
      'Want to sponsor a pet',
      'Looking to make a one-time contribution',
      'Happy to help rescued animals'
    ];
    
    donations.push({
      name: `${firstName} ${lastName}`,
      email: email,
      phone: user ? user.phone : `+91${randomInt(7000000000, 9999999999)}`,
      purpose: random(donationPurposes),
      message: seededRandom() > 0.3 ? random(messages) : undefined,
      user: user ? user._id : null,
      status: random(donationStatuses),
      createdAt: randomDate(0, 120),
      updatedAt: randomDate(0, 120)
    });
  }
  
  return donations;
}

async function generateBlogs() {
  console.log(`Generating ${CONFIG.blogs} blog posts...`);
  const blogs = [];
  
  // Expanded blog titles with Indian context (50 titles)
  const titles = [
    'How to Care for Your Newly Adopted Pet in India',
    'Understanding Pet Nutrition: A Complete Guide for Indian Pet Owners',
    'Training Tips for Rescue Dogs in Indian Households',
    'The Importance of Regular Vet Checkups in Indian Cities',
    'Creating a Safe Home Environment for Pets in Apartments',
    'Behavioral Issues in Rescued Animals: Indian Perspective',
    'Success Stories: Happy Endings from Indian Adoptions',
    'Community Support for Animal Welfare in India',
    'Adoption Process Explained: Step-by-Step Guide',
    'Health Tips for Senior Pets in Indian Climate',
    'Fostering: Making a Difference in Animal Rescue',
    'Pet Safety During Indian Festivals: Diwali, Holi, and More',
    'Best Pet Breeds for Indian Weather and Living Conditions',
    'Understanding Street Dogs: Adoption and Care Guide',
    'Pet Vaccination Schedule: Indian Veterinary Guidelines',
    'Managing Pet Allergies: Common Issues in Indian Homes',
    'Cost of Pet Ownership in India: Budget Planning',
    'Pet Grooming Tips for Hot Indian Summers',
    'Traveling with Pets in India: Tips and Guidelines',
    'Pet-Friendly Apartments: Finding the Right Home',
    'Feeding Street Animals: Dos and Don\'ts',
    'Adopting vs Buying: Making the Right Choice',
    'Pet Insurance in India: Is It Worth It?',
    'Common Pet Health Issues in Indian Climate',
    'Training Your Pet for Monsoon Season',
    'Pet First Aid: Essential Guide for Indian Pet Owners',
    'Introducing Pets to Indian Family Traditions',
    'Pet Care During Power Cuts and Summer Heat',
    'Understanding Animal Rights Laws in India',
    'Building a Pet-Friendly Community in India',
    'Pet Therapy and Mental Health Benefits',
    'Caring for Stray Puppies and Kittens',
    'Pet-Friendly Parks and Places in Major Indian Cities',
    'Dealing with Pet Separation Anxiety in Indian Families',
    'Pet Dental Care: Importance and Maintenance',
    'Spaying and Neutering: Why It Matters in India',
    'Pet Emergency Contacts: Important Numbers for Indian Pet Owners',
    'Creating Pet-Friendly Balconies in Indian Apartments',
    'Pet Exercise and Playtime in Urban Indian Settings',
    'Understanding Pet Body Language: Communication Guide',
    'Pet Care During COVID-19: Safety Guidelines',
    'Adopting Special Needs Pets: A Rewarding Experience',
    'Pet Photography Tips: Capturing Beautiful Moments',
    'Building Trust with Rescued Animals',
    'Pet Care Costs in Different Indian Cities',
    'Pet-Friendly Restaurants and Cafes in India',
    'Helping Pets Adjust to Indian Family Dynamics',
    'Pet Care During Wedding Season in India',
    'Understanding Pet Food Labels: Making Informed Choices',
    'Pet Care Myths Debunked: Indian Context'
  ];
  
  // Expanded excerpts matching titles
  const excerpts = [
    'Essential tips for welcoming your new pet home in Indian households.',
    'Discover proper pet nutrition fundamentals for Indian pet owners.',
    'Expert advice on training rescued dogs effectively in Indian settings.',
    'Why regular veterinary care is crucial for pets in India.',
    'Simple steps to pet-proof your Indian apartment or home.',
    'Understanding and addressing behavioral challenges in rescued animals.',
    'Inspiring adoption success stories from Indian families.',
    'How Indian communities can support animal rescue efforts.',
    'A comprehensive step-by-step guide to the adoption process.',
    'Special care considerations for older pets in Indian climate.',
    'The rewarding experience of fostering animals in need.',
    'Keeping your pets safe during Indian festivals and celebrations.',
    'Discover the best pet breeds suitable for Indian weather and living spaces.',
    'Learn how to adopt and care for street dogs responsibly.',
    'Essential pet vaccination schedule following Indian veterinary guidelines.',
    'Managing common pet allergies in Indian household environments.',
    'Understanding the real cost of pet ownership in Indian cities.',
    'Essential grooming tips for pets during hot Indian summers.',
    'Complete guide to traveling with pets across India.',
    'Tips for finding pet-friendly apartments in Indian cities.',
    'Responsible ways to feed and help street animals in India.',
    'Making an informed decision between adopting and buying pets.',
    'Understanding pet insurance options available in India.',
    'Common pet health issues specific to Indian climate conditions.',
    'Preparing your pet for monsoon season in India.',
    'Essential first aid guide every Indian pet owner should know.',
    'Helping your pet adapt to Indian family traditions and customs.',
    'Pet care strategies during power cuts and extreme summer heat.',
    'Understanding animal rights and protection laws in India.',
    'Building a supportive pet-friendly community in your area.',
    'Exploring the mental health benefits of pet therapy.',
    'Caring for stray puppies and kittens found in India.',
    'Discovering pet-friendly parks and spaces in major Indian cities.',
    'Managing pet separation anxiety in Indian family settings.',
    'Importance of dental care for pets and maintenance tips.',
    'Why spaying and neutering is crucial for India\'s pet population.',
    'Important emergency contact numbers for Indian pet owners.',
    'Creating safe and enjoyable pet-friendly balconies in apartments.',
    'Exercise and playtime ideas for pets in urban Indian settings.',
    'Understanding your pet\'s body language and communication signals.',
    'Pet care safety guidelines during COVID-19 pandemic.',
    'The rewarding experience of adopting special needs pets.',
    'Tips for capturing beautiful pet photographs and memories.',
    'Building trust and bonding with rescued animals.',
    'Understanding pet care costs across different Indian cities.',
    'Discovering pet-friendly restaurants and cafes in India.',
    'Helping pets adjust to traditional Indian family dynamics.',
    'Pet care considerations during wedding season in India.',
    'Making informed choices by understanding pet food labels.',
    'Debunking common pet care myths in Indian context.'
  ];
  
  // Expanded content matching titles with Indian context
  const contents = [
    `When you bring a newly adopted pet home to your Indian household, it's essential to create a calm and welcoming environment. Indian homes often have specific challenges like hot weather, noise from festivals, and family dynamics. Give your pet time to adjust to their new surroundings, introduce them gradually to family members, and ensure they have a quiet space to retreat to. Consider the climate and provide adequate cooling during summers.`,
    `Proper nutrition is the foundation of your pet's health in India. Understanding their dietary needs based on age, size, activity level, and Indian climate is crucial. Many pets in India face issues with heat and humidity, so hydration is key. Work with a local veterinarian to understand food options available in India and ensure balanced nutrition. Avoid feeding human food that might upset their stomach, especially spicy Indian dishes.`,
    `Rescue dogs often come with unique challenges, especially street dogs or those rescued from difficult situations. In Indian households, patience, consistency, and positive reinforcement are key to successful training. Understanding cultural differences in pet care is important - many Indian families have different expectations. Take time to build trust, establish routines, and be patient with behavioral adjustments.`,
    `Regular veterinary checkups are crucial in India due to climate-specific health issues like tick-borne diseases, heatstroke, and seasonal infections. Indian veterinarians understand local conditions and can provide appropriate care. Regular checkups help catch health issues early, especially important for rescue pets who may have hidden health problems. Vaccination schedules should follow Indian veterinary guidelines.`,
    `Pet-proofing your Indian home involves removing hazards like open staircases, loose wires, and small objects. In apartments, ensure balconies are secure and windows have screens. Indian homes often have multiple levels, so secure staircases. During festivals like Diwali, keep pets away from firecrackers and loud noises. Store food items securely as Indian kitchens often have tempting spices and ingredients.`,
    `Behavioral issues in rescued animals are common but manageable in Indian settings. Understanding their background helps in addressing these challenges. Many rescue animals in India have experienced street life, abuse, or neglect. With patience and proper training, most behavioral issues can be resolved. Work with local trainers who understand Indian pet behavior patterns.`,
    `Every adoption in India is a success story worth celebrating. These heartwarming tales inspire others to consider adoption over buying. Indian families who adopt often face unique challenges but also experience incredible joy. Share your adoption story to encourage others in your community to adopt. Success stories help combat the stigma around street dogs and rescue animals.`,
    `Community involvement is essential for animal welfare in India. There are many ways to contribute - volunteering at shelters, organizing community feeding programs, supporting local animal welfare NGOs, or simply being a responsible pet owner. Indian communities are becoming more aware of animal rights, and collective efforts make a significant difference.`,
    `The adoption process at AdoptNest is designed to ensure the best match between pets and Indian families. Here's what to expect: application review, home visit, meet-and-greet with the pet, and final adoption. We consider your living situation, family dynamics, and ability to care for the pet in Indian conditions. The process ensures the pet and family are a good fit.`,
    `Senior pets require special attention and care in Indian climate. Older pets are more sensitive to heat and may need extra care during summers. Understanding their needs helps them live comfortably in their golden years. Regular vet visits become even more important, and dietary adjustments may be needed. Provide comfortable bedding and ensure easy access to water and food.`,
    `Fostering provides temporary homes for animals in need and is crucial for rescue operations in India. It's a rewarding way to help without long-term commitment. Fosters play a vital role in preparing animals for adoption by helping them adjust to home environments. In India, where shelters are often overcrowded, fostering saves lives and helps animals find permanent homes.`,
    `Indian festivals can be stressful for pets. Diwali firecrackers, Holi colors, and loud celebrations can frighten animals. Taking precautions ensures they stay safe and comfortable during celebrations. Keep pets indoors during fireworks, ensure they have a quiet space, and avoid using toxic colors during Holi. Consider using calming aids or consulting your vet for anxious pets.`,
    `Choosing the right pet breed for Indian weather and living conditions is crucial. Some breeds handle heat better than others. Consider your living space - apartments may suit smaller breeds, while houses with yards can accommodate larger dogs. Indian breeds like Indian Pariah dogs are well-adapted to local climate. Research breeds that thrive in hot and humid conditions.`,
    `Street dogs (Indian Pariah dogs) make wonderful pets and are well-adapted to Indian conditions. When adopting a street dog, understand their background and be patient with socialization. They're often intelligent, loyal, and healthy. Work with local rescuers who can help you understand their needs and provide proper care. Many street dogs adapt well to home environments.`,
    `Pet vaccination in India follows specific schedules based on local disease prevalence. Rabies vaccination is mandatory and legally required. Work with a local veterinarian to understand the vaccination schedule for your area. Indian vets understand local health risks and can provide appropriate protection. Keep vaccination records updated for legal compliance and pet health.`,
    `Managing pet allergies in Indian homes requires understanding common allergens like dust, pollen, and seasonal changes. Indian climate can exacerbate allergies. Regular grooming, keeping homes clean, and using air purifiers can help. Some pets may be allergic to certain Indian foods or environmental factors. Consult your vet if you notice allergy symptoms.`,
    `Understanding the real cost of pet ownership in India helps in making informed decisions. Costs include food, veterinary care, grooming, vaccinations, and emergency care. Indian pet care costs vary by city - metro cities may be more expensive. Budget for regular expenses and emergency funds. Consider pet insurance options available in India for financial protection.`,
    `Pet grooming during hot Indian summers is essential for health and comfort. Regular bathing helps cool pets down, but avoid over-bathing which can dry their skin. Brushing removes loose fur and prevents matting. Trimming may be necessary for long-haired breeds. Ensure pets have access to shade and water. Consider professional grooming services available in your area.`,
    `Traveling with pets in India requires preparation and understanding of regulations. Many trains and flights have specific pet policies. Ensure pets are vaccinated and have proper documentation. Plan for rest stops and ensure pets stay hydrated during travel. Some hotels and accommodations in India are pet-friendly - research in advance. Carry familiar items to reduce stress.`,
    `Finding pet-friendly apartments in Indian cities can be challenging but is possible. Many modern apartment complexes now allow pets, though some have restrictions. Be honest with landlords about pets and offer references. Some cities have more pet-friendly options than others. Consider ground floor apartments for easy access. Understand lease agreements regarding pets before signing.`,
    `Feeding street animals responsibly in India requires understanding local regulations and best practices. Many cities have guidelines about feeding street animals. Work with local animal welfare groups to coordinate feeding programs. Ensure food is safe and appropriate. Don't feed near busy roads. Consider supporting organized feeding programs rather than random feeding.`,
    `Choosing between adopting and buying a pet in India involves considering animal welfare, costs, and availability. Adoption saves lives and gives homes to animals in need. Buying from breeders supports a market that may contribute to overpopulation. Many wonderful pets are available for adoption. Consider adoption first - you may find your perfect companion while helping animals in need.`,
    `Pet insurance in India is becoming more available and can provide financial protection for unexpected veterinary costs. Understand what's covered and what's not. Compare different insurance providers and plans. Consider your pet's age, breed, and potential health issues. Insurance can be especially valuable for rescue pets who may have unknown health backgrounds.`,
    `Common pet health issues in Indian climate include heatstroke, tick-borne diseases, skin infections, and seasonal allergies. Understanding these issues helps in prevention and early treatment. Indian summers require extra care to prevent heatstroke. Monsoon season brings fungal infections and other issues. Regular vet checkups help catch problems early.`,
    `Preparing your pet for monsoon season in India involves protecting them from rain, preventing fungal infections, and ensuring they stay warm and dry. Keep pets indoors during heavy rains. Dry them thoroughly if they get wet. Watch for signs of skin infections. Ensure they have dry bedding. Avoid walking in flooded areas which may contain harmful substances.`,
    `Pet first aid knowledge is essential for Indian pet owners as veterinary care may not always be immediately available. Learn basic first aid procedures for common emergencies like heatstroke, injuries, poisoning, and choking. Keep a pet first aid kit at home. Know emergency veterinary contacts in your area. Understand when to seek immediate veterinary care versus when home care is sufficient.`,
    `Introducing pets to Indian family traditions requires patience and gradual exposure. Many Indian families have specific customs, festivals, and gatherings that pets need to adjust to. Help pets become comfortable with extended family members, loud celebrations, and new environments. Positive reinforcement and gradual exposure help pets adapt to Indian family dynamics.`,
    `Pet care during power cuts and extreme summer heat in India requires preparation. Ensure pets have access to water and cool areas. Battery-operated fans or cooling mats can help. Plan for regular power outages by keeping emergency supplies. Never leave pets in cars or enclosed spaces during heat. Consider backup power options for essential pet care equipment.`,
    `Understanding animal rights laws in India helps pet owners know their rights and responsibilities. The Prevention of Cruelty to Animals Act protects animals from abuse. Know local regulations about pet ownership, licensing, and animal welfare. Support efforts to strengthen animal protection laws. Report animal cruelty to appropriate authorities.`,
    `Building a pet-friendly community in India starts with responsible pet ownership and neighbor cooperation. Encourage pet-friendly policies in housing societies. Organize community events that include pets. Educate neighbors about responsible pet ownership. Address concerns respectfully. Work together to create a supportive environment for pets and their owners.`,
    `Pet therapy provides mental health benefits and is increasingly recognized in India. Pets reduce stress, anxiety, and depression. They provide companionship and unconditional love. Therapy pets visit hospitals, schools, and care facilities. Consider how your pet might help others through therapy work. The bond between humans and animals has profound positive effects.`,
    `Caring for stray puppies and kittens found in India requires immediate action and proper knowledge. If you find abandoned animals, provide immediate care with food, water, and warmth. Contact local animal rescue organizations. Don't attempt to care for very young animals without proper knowledge - they need specialized care. Consider fostering until permanent homes are found.`,
    `Pet-friendly parks and places in major Indian cities are growing in number. Many cities now have designated dog parks and pet-friendly spaces. Research parks in your city that welcome pets. Follow park rules and etiquette - clean up after pets, keep them leashed if required, and ensure they're vaccinated. Support efforts to create more pet-friendly public spaces.`,
    `Dealing with pet separation anxiety in Indian families where members may be away for work or school requires understanding and management strategies. Gradual training helps pets adjust to being alone. Provide enrichment activities and safe spaces. Consider pet sitters or day care if needed. Some pets benefit from calming aids. Work with trainers who understand separation anxiety.`,
    `Pet dental care is important but often overlooked by Indian pet owners. Regular dental care prevents gum disease, tooth loss, and other health issues. Brush your pet's teeth regularly, provide dental chews, and schedule professional cleanings. Indian pets are as susceptible to dental problems as pets anywhere. Good dental health contributes to overall health.`,
    `Spaying and neutering is crucial for controlling India's pet population and improving pet health. It prevents unwanted litters, reduces roaming behavior, and provides health benefits. Many Indian cities have sterilization programs. Support these programs and ensure your pets are sterilized. This is especially important for pets allowed to roam, even partially.`,
    `Having emergency contact numbers for Indian pet owners ensures quick help when needed. Keep numbers for 24-hour veterinary clinics, animal ambulances, poison control, and animal welfare organizations in your area. Program these into your phone. Know the location of emergency veterinary facilities. Time is critical in pet emergencies.`,
    `Creating pet-friendly balconies in Indian apartments requires safety considerations. Ensure railings are secure and gaps are small enough that pets can't fall through. Provide shade and water. Avoid plants toxic to pets. Create comfortable spaces for pets to enjoy fresh air safely. Many Indian apartments have balconies that can be made pet-safe with proper precautions.`,
    `Exercise and playtime for pets in urban Indian settings requires creativity due to space limitations. Use indoor games, short walks in safe areas, and interactive toys. Many Indian cities have limited green spaces, so maximize available opportunities. Consider pet day care facilities for additional exercise. Adapt exercise routines to Indian weather conditions.`,
    `Understanding your pet's body language helps in communication and recognizing when something is wrong. Learn to read signs of happiness, fear, aggression, and illness. Each pet is unique, but general body language cues are universal. Pay attention to tail position, ear position, eye contact, and overall posture. This understanding improves your relationship with your pet.`,
    `Pet care during COVID-19 requires following safety guidelines while ensuring pets receive proper care. Maintain hygiene when handling pets. Follow veterinary clinic safety protocols. Ensure pets receive necessary veterinary care despite restrictions. Some services may be limited, so plan ahead. Keep emergency supplies stocked. Pets provide comfort during difficult times.`,
    `Adopting special needs pets provides a rewarding experience and saves lives. Special needs pets may have physical disabilities, medical conditions, or behavioral challenges requiring extra care. Many special needs pets adapt remarkably well and live happy lives. The bond with a special needs pet can be particularly strong. Consider if you have the resources and commitment.`,
    `Pet photography captures beautiful moments and memories with your furry friends. Use natural light, be patient, and capture pets in their natural behaviors. Indian festivals and celebrations provide great photo opportunities. Share photos to promote pet adoption and responsible ownership. Professional pet photographers are available in many Indian cities.`,
    `Building trust with rescued animals takes time and patience, especially for animals with difficult pasts. Use positive reinforcement, respect their boundaries, and be consistent. Trust-building is gradual and requires understanding their history. Many rescued animals eventually overcome their fears and become loving companions. The reward of earning their trust is immeasurable.`,
    `Pet care costs vary across different Indian cities. Metro cities like Mumbai, Delhi, and Bangalore may have higher costs than smaller cities. Factor in veterinary costs, food, grooming, and other expenses when planning. Research costs in your specific area. Budget accordingly and consider all aspects of pet ownership.`,
    `Pet-friendly restaurants and cafes are growing in number across India. Many establishments now welcome pets, especially in outdoor areas. Research pet-friendly venues in your city. Follow restaurant policies regarding pets. Ensure your pet is well-behaved in public settings. Support businesses that welcome pets to encourage more pet-friendly options.`,
    `Helping pets adjust to Indian family dynamics involves understanding extended family structures, traditional customs, and household routines. Indian families often have multiple generations living together. Help pets become comfortable with all family members. Respect cultural practices while ensuring pet welfare. Gradual introduction and positive experiences help pets adapt.`,
    `Pet care during wedding season in India requires planning for busy schedules, noise, and changes in routine. Indian weddings are elaborate and can disrupt pet routines. Ensure pets have quiet spaces away from celebrations. Plan for pet care if family is traveling for weddings. Consider pet sitters or boarding if needed. Maintain regular feeding and exercise schedules.`,
    `Understanding pet food labels helps in making informed choices for your pet's nutrition. Learn to read ingredient lists, nutritional information, and feeding guidelines. Indian pet food markets offer various options. Choose quality food appropriate for your pet's age, size, and health needs. Consult veterinarians for recommendations. Avoid foods with unnecessary fillers or harmful ingredients.`,
    `Many pet care myths exist in India that need debunking for proper pet care. Common myths include beliefs about feeding, behavior, health, and training. Consult with veterinarians and reliable sources for accurate information. Don't follow unverified advice from social media or neighbors. Evidence-based pet care ensures your pet's health and happiness.`
  ];
  
  const authors = ['Dr. Priya Sharma', 'AdoptNest Team', 'Dr. Rajesh Kumar', 'Veterinary Expert', 'Pet Care Specialist', 'Dr. Anjali Mehta', 'Rescue Coordinator', 'Animal Welfare Advocate', `${random(firstNames)} ${random(lastNames)}`, 'Dr. Vikram Singh'];
  
  // Generate or upload blog images
  if (GITHUB_AUTO_UPLOAD) {
    console.log('  Uploading blog images to GitHub and generating jsDelivr URLs...');
  } else if (JSDELIVR_CONFIGURED) {
    console.log('  Generating jsDelivr CDN URLs for blog images...');
  } else {
    console.log('  Using placeholder URLs for blog images...');
  }
  
  const blogImages = [];
  for (let i = 0; i < CONFIG.blogs; i++) {
    try {
      const repoPath = `blog/blog-${i + 1}.jpg`;
      const placeholderUrl = getPlaceholderImageUrl('blog', 1200, 630, i);
      
      let imageUrl;
      if (GITHUB_AUTO_UPLOAD) {
        imageUrl = await uploadImageToGitHubAndGetUrl(placeholderUrl, repoPath, 'blog');
        await new Promise(resolve => setTimeout(resolve, 200));
        if (i % 10 === 0) {
          console.log(`    Uploaded ${i + 1}/${CONFIG.blogs} blog images...`);
        }
      } else {
        imageUrl = getImageUrlForSeed(repoPath, 'blog', `blog-${i + 1}.jpg`);
        if (i % 10 === 0 && JSDELIVR_CONFIGURED) {
          console.log(`    Generated ${i + 1}/${CONFIG.blogs} jsDelivr URLs...`);
        }
      }
      
      blogImages.push(imageUrl);
    } catch (error) {
      console.warn(`  Warning: Could not process blog image ${i + 1}: ${error.message}`);
      blogImages.push(getPlaceholderImageUrl('blog', 1200, 630, i));
    }
  }
  
  // Generate exactly CONFIG.blogs (50) blog posts
  for (let i = 0; i < CONFIG.blogs; i++) {
    const title = titles[i % titles.length];
    const excerpt = excerpts[i % excerpts.length];
    const content = contents[i % contents.length];
    const slug = slugify(title);
    const readTime = random(['3 min', '5 min', '7 min', '10 min']);
    
    blogs.push({
      title: title,
      slug: `${slug}-${i + 1}`,
      category: random(blogCategories),
      author: random(authors),
      date: randomDate(0, 365),
      readTime: readTime,
      // Use jsDelivr CDN URL or placeholder URL
      image: blogImages[i] || getSeedImageUrl('blog', i),
      excerpt: excerpt,
      content: content + `\n\nThis article is part of AdoptNest's commitment to helping Indian families provide the best care for their pets. For more information about pet adoption, visit our website or contact our team.`,
      published: seededRandom() > 0.1, // 90% published
      createdAt: randomDate(0, 365),
      updatedAt: randomDate(0, 180)
    });
  }
  
  return blogs;
}

function generateMessages() {
  console.log(`Generating ${CONFIG.messages} contact messages...`);
  const messages = [];
  const subjects = [
    'Adoption Inquiry',
    'General Question',
    'Volunteer Interest',
    'Donation Question',
    'Pet Surrender',
    'Service Booking',
    'Feedback',
    'Partnership Inquiry'
  ];
  
  const messageTemplates = [
    'I am interested in adopting a {type}. Can you provide more information?',
    'I have a question about your adoption process.',
    'I would like to volunteer with your organization.',
    'I want to know more about donation options.',
    'I need to surrender my pet. What is the process?',
    'I am interested in booking a service.',
    'Thank you for the great work you do!',
    'I would like to discuss a potential partnership.'
  ];
  
  for (let i = 0; i < CONFIG.messages; i++) {
    const firstName = random(firstNames);
    const lastName = random(lastNames);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    const type = random(['dog', 'cat', 'pet']);
    const message = random(messageTemplates).replace(/{type}/g, type);
    
    messages.push({
      name: `${firstName} ${lastName}`,
      email: email,
      message: `${random(subjects)}: ${message}`,
      status: random(messageStatuses),
      createdAt: randomDate(0, 90),
      updatedAt: randomDate(0, 90)
    });
  }
  
  return messages;
}

// Main seeding function
async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI_DEV || process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('❌ Error: MONGODB_URI_DEV or MONGODB_URI environment variable is required');
    process.exit(1);
  }
  
  // Safety check - ensure it's MongoDB Atlas
  if (!mongoUri.startsWith('mongodb+srv://')) {
    console.error('❌ Error: This script requires MongoDB Atlas connection string');
    console.error('   Local MongoDB connections are not supported');
    console.error('   Expected format: mongodb+srv://username:password@cluster.mongodb.net/database');
    process.exit(1);
  }
  
  // Safety check - ensure it's a dev/test database
  const dbName = mongoUri.split('/').pop()?.split('?')[0] || '';
  if (!dbName.includes('dev') && !dbName.includes('test')) {
    if (process.env.FORCE_SEED !== 'true') {
      console.error('❌ Error: This script only works with development/test databases');
      console.error(`   Database name "${dbName}" must contain "dev" or "test"`);
      console.error('   Set FORCE_SEED=true to override this check (use with caution)');
      process.exit(1);
    } else {
      console.warn('⚠️  WARNING: FORCE_SEED=true is set. Seeding production database!');
    }
  }
  
  // Validate GitHub token if auto-upload is enabled
  if (GITHUB_AUTO_UPLOAD) {
    console.log('🔐 Validating GitHub token...');
    const isValid = await validateGitHubToken();
    if (!isValid) {
      console.error('❌ Error: GitHub token is invalid or not configured');
      console.error('   Set GITHUB_TOKEN in .env with a valid Personal Access Token');
      console.error('   Token needs "repo" scope to upload files');
      console.error('   See GITHUB_AUTO_UPLOAD_SETUP.md for instructions');
      process.exit(1);
    }
    console.log('✅ GitHub token validated\n');
  }
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Adoption.deleteMany({});
    await Surrender.deleteMany({});
    await Booking.deleteMany({});
    await SuccessStory.deleteMany({});
    await Volunteer.deleteMany({});
    await DonationContact.deleteMany({});
    await BlogPost.deleteMany({});
    await ContactMessage.deleteMany({});
    console.log('✅ Cleared existing data\n');
    
    // Generate and insert data
    const users = await User.insertMany(await generateUsers());
    console.log(`✅ Inserted ${users.length} users\n`);
    
    // Ensure users array is valid before generating pets
    if (!users || users.length === 0) {
      throw new Error('No users were created. Cannot generate pets without users.');
    }
    
    // Generate pets with downloaded images
    const petsData = await generatePets(users);
    if (!petsData || petsData.length === 0) {
      throw new Error('No pets were generated');
    }
    
    const pets = await Pet.insertMany(petsData);
    console.log(`✅ Inserted ${pets.length} pets\n`);
    
    const adoptions = await Adoption.insertMany(generateAdoptionRequests(users, pets));
    console.log(`✅ Inserted ${adoptions.length} adoption requests\n`);
    
    // Generate surrenders with downloaded images
    const surrenders = await Surrender.insertMany(await generateSurrenders(users));
    console.log(`✅ Inserted ${surrenders.length} surrenders\n`);
    
    const bookings = await Booking.insertMany(generateBookings(users, pets));
    console.log(`✅ Inserted ${bookings.length} bookings\n`);
    
    // Generate stories with downloaded images
    const stories = await SuccessStory.insertMany(await generateStories(pets));
    console.log(`✅ Inserted ${stories.length} success stories\n`);
    
    const volunteers = await Volunteer.insertMany(generateVolunteers());
    console.log(`✅ Inserted ${volunteers.length} volunteers\n`);
    
    const donations = await DonationContact.insertMany(generateDonations(users));
    console.log(`✅ Inserted ${donations.length} donation contacts\n`);
    
    // Generate blogs with downloaded images
    const blogs = await BlogPost.insertMany(await generateBlogs());
    console.log(`✅ Inserted ${blogs.length} blog posts\n`);
    
    const messages = await ContactMessage.insertMany(generateMessages());
    console.log(`✅ Inserted ${messages.length} contact messages\n`);
    
    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Admin Users:        ${CONFIG.adminUsers} (exactly 2)`);
    console.log(`Normal Users:       ${CONFIG.normalUsers} (exactly 25)`);
    console.log(`Total Users:        ${users.length}`);
    console.log(`Pets:               ${pets.length} (exactly 100)`);
    console.log(`Adoption Requests:  ${adoptions.length} (exactly ${CONFIG.adoptionRequests})`);
    console.log(`Surrenders:         ${surrenders.length} (exactly ${CONFIG.surrenders})`);
    console.log(`Bookings:           ${bookings.length} (exactly ${CONFIG.bookings})`);
    console.log(`Success Stories:    ${stories.length} (exactly ${CONFIG.stories})`);
    console.log(`Volunteers:         ${volunteers.length} (exactly ${CONFIG.volunteers})`);
    console.log(`Donation Contacts:  ${donations.length} (exactly ${CONFIG.donations})`);
    console.log(`Blog Posts:         ${blogs.length} (exactly ${CONFIG.blogs})`);
    console.log(`Contact Messages:   ${messages.length} (exactly ${CONFIG.messages})`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n✅ Database seeding completed successfully!`);
    console.log(`\n🔐 Admin Credentials:`);
    console.log(`   1. Email: Jashkaranjoshi@gmail.com, Password: 123456`);
    console.log(`   2. Email: Admin@gmail.com, Password: admin@123`);
    console.log(`\n👥 Normal User Password: user@123 (for all 25 users)`);
    console.log(`\n📝 Note: Analytics collection not created (model not found)`);
    console.log(`   You can create analytics data separately if needed.\n`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✨ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };

