import axios from "axios";
import { rateLimiter } from "../utils/helpers/rateLimiter";

// Create axios instance with default settings
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
    headers: { "Content-Type": "application/json" },
    timeout: 30000, // 30 seconds
});

// Intercept requests before they're sent
// This adds authentication tokens and checks rate limits
api.interceptors.request.use(
    (config) => {
        // Check rate limit (prevent too many requests)
        const endpoint = `${config.method?.toUpperCase()}_${config.url}`;
        if (!rateLimiter.isAllowed(endpoint, { windowMs: 60000, maxRequests: 30 })) {
            const remaining = rateLimiter.getRemaining(endpoint);
            return Promise.reject({
                message: `Rate limit exceeded. Please wait before making another request. (${remaining} requests remaining)`,
                code: "RATE_LIMIT_EXCEEDED",
                isRateLimit: true,
            });
        }

        // Add authentication token if user is logged in
        const user = localStorage.getItem("adoptnest_user");
        if (user) {
            try {
                const userData = JSON.parse(user);
                if (userData.token) {
                    config.headers.Authorization = `Bearer ${userData.token}`;
                }
            } catch (e) {
                console.error("Error parsing user data:", e);
            }
        }
        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject({
            message: "Request failed. Please check your connection and try again.",
            code: "REQUEST_ERROR",
            originalError: error,
        });
    }
);

// Intercept responses to handle errors consistently
// This converts server errors into user-friendly messages
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle rate limit errors
        if (error.isRateLimit || error.code === "RATE_LIMIT_EXCEEDED") {
            return Promise.reject({
                message: error.message || "Rate limit exceeded. Please wait before trying again.",
                code: "RATE_LIMIT_EXCEEDED",
                status: 429,
            });
        }

        // Handle network errors (no internet, server down, etc.)
        if (!error.response) {
            if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
                return Promise.reject({
                    message: "Request timed out. Please try again.",
                    code: "TIMEOUT",
                    status: 408,
                });
            }
            return Promise.reject({
                message: "Network error. Please check your connection and try again.",
                code: "NETWORK_ERROR",
                status: 0,
            });
        }

        // Handle HTTP status code errors
        const status = error.response.status;
        const data = error.response.data || {};
        let message = data.message || "An error occurred. Please try again.";

        switch (status) {
            case 400:
                message = data.message || "Invalid request. Please check your input and try again.";
                break;
            case 401:
                // User not logged in or session expired - redirect to login
                localStorage.removeItem("adoptnest_user");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                message = "Your session has expired. Please log in again.";
                break;
            case 403:
                message = data.message || "You don't have permission to perform this action.";
                break;
            case 404:
                message = data.message || "The requested resource was not found.";
                break;
            case 409:
                message = data.message || "A conflict occurred. The resource may have been modified.";
                break;
            case 422:
                message = data.message || "Validation failed. Please check your input.";
                break;
            case 429:
                message = data.message || "Too many requests. Please wait before trying again.";
                break;
            case 500:
                message = data.message || "Server error. Please try again later.";
                break;
            case 503:
                message = "Service temporarily unavailable. Please try again later.";
                break;
            default:
                message = data.message || `An error occurred (${status}). Please try again.`;
        }

        return Promise.reject({
            message,
            code: data.code || `HTTP_${status}`,
            status,
            data: data.errors || data,
        });
    }
);

// Pet endpoints
export const fetchPets = (query = "") => api.get(`/pets${query}`);
export const fetchPet = (id) => api.get(`/pets/${id}`);
export const createPet = (data) => {
  // If FormData, use multipart/form-data headers
  if (data instanceof FormData) {
    return api.post("/pets", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
  return api.post("/pets", data);
};
export const updatePet = (id, data) => {
  // If FormData, use multipart/form-data headers
  if (data instanceof FormData) {
    return api.put(`/pets/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
  return api.put(`/pets/${id}`, data);
};
export const deletePet = (id) => api.delete(`/pets/${id}`);

// Adoption endpoints
export const submitAdoption = (data) => api.post("/adoptions", data);
export const fetchAdoptions = (query = "") => api.get(`/adoptions${query}`);
export const fetchAdoption = (id) => api.get(`/adoptions/${id}`);
export const updateAdoptionStatus = (id, status) => api.patch(`/adoptions/${id}`, { status });

// Surrender endpoints
export const submitSurrender = (data) => {
  // Handle FormData for file uploads
  if (data instanceof FormData) {
    return api.post("/surrenders", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
  return api.post("/surrenders", data);
};
export const fetchSurrenders = () => api.get("/surrenders");
export const fetchSurrender = (id) => api.get(`/surrenders/${id}`);
export const updateSurrenderStatus = (id, status) => api.patch(`/surrenders/${id}`, { status });

// Booking endpoints
export const createBooking = (data) => api.post("/bookings", data);
export const fetchBookings = () => api.get("/bookings");
export const fetchBooking = (id) => api.get(`/bookings/${id}`);
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data);
export const cancelBooking = (id) => api.delete(`/bookings/${id}`);

// Auth endpoints
export const login = (email, password) => api.post("/auth/login", { email, password });
export const signup = (data) => api.post("/auth/signup", data);
export const logout = () => api.post("/auth/logout");
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email });
export const resetPassword = (token, password) => api.post("/auth/reset-password", { token, password });

// Contact endpoints
export const submitContact = (data) => api.post("/contact", data);
export const fetchContactMessages = () => api.get("/contact");
export const markMessageRead = (id) => api.patch(`/contact/${id}`);

// User endpoints
export const fetchUserProfile = () => api.get("/users/me");
export const updateUserProfile = (data) => api.put("/users/me", data);

// Admin endpoints
export const fetchAdminStats = () => api.get("/admin/stats");
export const fetchAdminUsers = (query = "") => api.get(`/admin/users${query}`);
export const updateAdminUser = (id, data) => api.patch(`/admin/users/${id}`, data);

// Success Story endpoints
export const fetchStories = (query = "") => api.get(`/stories${query}`);
export const fetchStory = (id) => api.get(`/stories/${id}`);
export const createStory = (data) => {
  if (data instanceof FormData) {
    return api.post("/stories", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
  return api.post("/stories", data);
};
export const updateStory = (id, data) => {
  if (data instanceof FormData) {
    return api.put(`/stories/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
  return api.put(`/stories/${id}`, data);
};
export const deleteStory = (id) => api.delete(`/stories/${id}`);

// Volunteer endpoints
export const fetchVolunteers = (query = "") => api.get(`/volunteers${query}`);
export const fetchVolunteer = (id) => api.get(`/volunteers/${id}`);
export const createVolunteer = (data) => api.post("/volunteers", data);
export const updateVolunteer = (id, data) => api.put(`/volunteers/${id}`, data);
export const deleteVolunteer = (id) => api.delete(`/volunteers/${id}`);

// Donation Contact endpoints
export const fetchDonationContacts = (query = "") => api.get(`/donation-contact${query}`);
export const fetchDonationContact = (id) => api.get(`/donation-contact/${id}`);
export const createDonationContact = (data) => api.post("/donation-contact", data);
export const updateDonationContact = (id, data) => api.put(`/donation-contact/${id}`, data);
export const deleteDonationContact = (id) => api.delete(`/donation-contact/${id}`);

// Blog endpoints
export const fetchBlogPosts = (query = "") => api.get(`/blog${query}`);
export const fetchBlogPost = (id) => {
  // Ensure id is properly encoded for URL (axios doesn't auto-encode path params)
  const encodedId = encodeURIComponent(String(id));
  return api.get(`/blog/${encodedId}`);
};
export const createBlogPost = (data) => {
  if (data instanceof FormData) {
    return api.post("/blog", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
  return api.post("/blog", data);
};
export const updateBlogPost = (id, data) => {
  if (data instanceof FormData) {
    return api.put(`/blog/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
  return api.put(`/blog/${id}`, data);
};
export const deleteBlogPost = (id) => api.delete(`/blog/${id}`);

export default api;
