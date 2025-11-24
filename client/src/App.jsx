import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/features/ProtectedRoute";
import ScrollToTop from "./components/features/ScrollToTop";

// Content Pages
import Home from "./pages/content/Home";
import Blog from "./pages/content/Blog";
import BlogPost from "./pages/content/BlogPost";
import About from "./pages/content/About";
import FAQ from "./pages/content/FAQ";
import SuccessStories from "./pages/content/SuccessStories";

// Pet Pages
import Adopt from "./pages/pets/Adopt";
import PetDetails from "./pages/pets/PetDetails";
import AdoptionForm from "./pages/pets/AdoptionForm";
import GivePet from "./pages/pets/GivePet";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";

// User Pages
import Dashboard from "./pages/user/Dashboard";
import Favorites from "./pages/user/Favorites";
import Bookings from "./pages/user/Bookings";
import ViewItem from "./pages/user/ViewItem";
import Notifications from "./pages/user/Notifications";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAddPet from "./pages/admin/AdminAddPet";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminViewItem from "./pages/admin/AdminViewItem";

// Service Pages
import BookService from "./pages/services/BookService";

// Support Pages
import Contact from "./pages/support/Contact";
import Donate from "./pages/support/Donate";
import Volunteer from "./pages/support/Volunteer";

// Legal Pages
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";

// Common Pages
import NotFound from "./pages/common/NotFound";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 min-h-[calc(100vh-5rem)] w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adopt" element={<Adopt />} />
          <Route path="/adopt/:id" element={<PetDetails />} />
          <Route
            path="/give"
            element={
              <ProtectedRoute>
                <GivePet />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          {/* Public Browsing Pages */}
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Protected Action Routes - Require Login */}
          <Route
            path="/adopt/apply"
            element={
              <ProtectedRoute>
                <AdoptionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adopt/apply/:id"
            element={
              <ProtectedRoute>
                <AdoptionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/volunteer"
            element={
              <ProtectedRoute>
                <Volunteer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donate"
            element={
              <ProtectedRoute>
                <Donate />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/book-service"
            element={
              <ProtectedRoute>
                <BookService />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-service/:petId"
            element={
              <ProtectedRoute>
                <BookService />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/view/:type/:id"
            element={
              <ProtectedRoute>
                <ViewItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/view/:type/:id"
            element={
              <ProtectedRoute adminOnly>
                <AdminViewItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add"
            element={
              <ProtectedRoute adminOnly>
                <AdminAddPet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}