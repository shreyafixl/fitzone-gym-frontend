import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

import "./App.css";

// ── Lazy-loaded pages ────────────────────────────────────────
const Home                  = lazy(() => import("./pages/Home"));
const ClassesPage           = lazy(() => import("./pages/ClassesPage"));
const PricingPage           = lazy(() => import("./pages/PricingPage"));
const ContactPage           = lazy(() => import("./pages/ContactPage"));
const EquipmentPage         = lazy(() => import("./pages/EquipmentPage"));
const AboutPage             = lazy(() => import("./pages/AboutPage"));
const TrainersPage          = lazy(() => import("./pages/TrainersPage"));
const GalleryPage           = lazy(() => import("./pages/GalleryPage"));
const TestimonialsPage      = lazy(() => import("./pages/TestimonialsPage"));
const FAQPage               = lazy(() => import("./pages/FAQPage"));
const FacilitiesPage        = lazy(() => import("./pages/FacilitiesPage"));
const LoginPage             = lazy(() => import("./pages/LoginPage"));
const DashboardPage         = lazy(() => import("./pages/DashboardPage"));
const TrainerDashboardPage  = lazy(() => import("./pages/TrainerDashboardPage"));
const AdminDashboardPage    = lazy(() => import("./pages/AdminDashboardPage"));
const SuperAdminDashboardPage = lazy(() => import("./pages/SuperAdminDashboardPage"));

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-spinner"></div>
      <p>Loading…</p>
    </div>
  );
}

// Dashboard routes get their own full-viewport layout — no site navbar/footer
const DASHBOARD_PATHS = ["/dashboard"];

function AppShell() {
  const location = useLocation();
  const isDashboard = DASHBOARD_PATHS.some(p => location.pathname.startsWith(p));

  return (
    <>
      {!isDashboard && <Navbar />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/"             element={<Home />} />
          <Route path="/about"        element={<AboutPage />} />
          <Route path="/classes"      element={<ClassesPage />} />
          <Route path="/equipment"    element={<EquipmentPage />} />
          <Route path="/facilities"   element={<FacilitiesPage />} />
          <Route path="/trainers"     element={<TrainersPage />} />
          <Route path="/pricing"      element={<PricingPage />} />
          <Route path="/gallery"      element={<GalleryPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/faq"          element={<FAQPage />} />
          <Route path="/contact"      element={<ContactPage />} />
          <Route path="/login"        element={<LoginPage />} />

          {/* ── Protected dashboard routes ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['member']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/trainer"
            element={
              <ProtectedRoute allowedRoles={['trainer']}>
                <TrainerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/superadmin"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      {!isDashboard && <Footer />}
      <ScrollToTop />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <AppShell />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
