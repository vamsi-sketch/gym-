import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ProgramsPage } from './pages/public/ProgramsPage';
import { TrainersPage } from './pages/public/TrainersPage';
import { MembershipsPage } from './pages/public/MembershipsPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { UserDashboard } from './pages/user/UserDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { apiService } from './services/api';
import { ContactInfo, GymTimings, HomepageContent } from './types';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper for public pages with shared dynamic Navbar and Footer
function PublicLayout({
  children,
  homepage,
  contact,
  timings,
}: {
  children: React.ReactNode;
  homepage: HomepageContent | null;
  contact: ContactInfo | null;
  timings: GymTimings | null;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-neutral-100">
      <Navbar homepage={homepage} />
      <main className="flex-1">{children}</main>
      <Footer homepage={homepage} contact={contact} timings={timings} />
    </div>
  );
}

export default function App() {
  const [homepage, setHomepage] = useState<HomepageContent | null>(null);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [timings, setTimings] = useState<GymTimings | null>(null);

  useEffect(() => {
    // Fetch global branding, contact, and timings
    Promise.all([apiService.getHomepage(), apiService.getContact(), apiService.getTimings()])
      .then(([h, c, t]) => {
        setHomepage(h);
        setContact(c);
        setTimings(t);
      })
      .catch((err) => console.error('Failed to load global gym branding', err));
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Admin Dashboard (Isolated layout, no public header/footer) */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Member Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PublicLayout homepage={homepage} contact={contact} timings={timings}>
                <UserDashboard />
              </PublicLayout>
            }
          />

          {/* Public Website Routes */}
          <Route
            path="/"
            element={
              <PublicLayout homepage={homepage} contact={contact} timings={timings}>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout homepage={homepage} contact={contact} timings={timings}>
                <AboutPage />
              </PublicLayout>
            }
          />
          <Route
            path="/programs"
            element={
              <PublicLayout homepage={homepage} contact={contact} timings={timings}>
                <ProgramsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/trainers"
            element={
              <PublicLayout homepage={homepage} contact={contact} timings={timings}>
                <TrainersPage />
              </PublicLayout>
            }
          />
          <Route
            path="/memberships"
            element={
              <PublicLayout homepage={homepage} contact={contact} timings={timings}>
                <MembershipsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/gallery"
            element={
              <PublicLayout homepage={homepage} contact={contact} timings={timings}>
                <GalleryPage />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout homepage={homepage} contact={contact} timings={timings}>
                <ContactPage />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout homepage={homepage} contact={contact} timings={timings}>
                <LoginPage />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout homepage={homepage} contact={contact} timings={timings}>
                <RegisterPage />
              </PublicLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
