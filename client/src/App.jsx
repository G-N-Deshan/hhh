import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingQAWidget from "./components/FloatingQAWidget";

// Public Pages
import Home from "./pages/Home";
import Opportunities from "./pages/Opportunities";
import OpportunityDetails from "./pages/OpportunityDetails";
import OpportunityForm from "./pages/OpportunityForm";
import ReportBarrierPage from "./pages/ReportBarrierPage";
import QA from "./pages/QA";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import UserProfilePage from "./pages/user/UserProfilePage";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageOpportunities from "./pages/admin/ManageOpportunities";
import ManageBarrierReports from "./pages/admin/ManageBarrierReports";
import ManageUsers from "./pages/admin/ManageUsers";

function AdminRouteGuard({ children }) {
  const { user, isAdmin } = useAuth();
  if (user && isAdmin) {
    return children;
  }
  return <AdminLogin />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white relative">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#ffffff",
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
                borderRadius: "12px",
                fontSize: "13px",
              },
            }}
          />

          <Navbar />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/opportunities/:id" element={<OpportunityDetails />} />
              <Route path="/opportunities/create" element={<OpportunityForm />} />
              <Route path="/opportunities/edit/:id" element={<OpportunityForm />} />
              <Route path="/report-barrier" element={<ReportBarrierPage />} />
              <Route path="/qa" element={<QA />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Dashboard & Dedicated Profile / Wishlist Pages */}
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/wishlist" element={<UserProfilePage />} />

              {/* Admin Portal Routes */}
              <Route path="/admin" element={<AdminRouteGuard><AdminDashboardPage /></AdminRouteGuard>} />
              <Route path="/admin/dashboard" element={<AdminRouteGuard><AdminDashboardPage /></AdminRouteGuard>} />
              <Route path="/admin/opportunities" element={<AdminRouteGuard><ManageOpportunities /></AdminRouteGuard>} />
              <Route path="/admin/barriers" element={<AdminRouteGuard><ManageBarrierReports /></AdminRouteGuard>} />
              <Route path="/admin/users" element={<AdminRouteGuard><ManageUsers /></AdminRouteGuard>} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Floating Right-Side Corner Q&A Board Widget */}
          <FloatingQAWidget />

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

