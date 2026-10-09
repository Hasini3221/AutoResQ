import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { IncidentProvider } from './context/IncidentContext';
import { Navbar } from './components/layout/Navbar';
import { SafetyNoticeBanner } from './components/common/SafetyNoticeBanner';
import { AuthScreen } from './components/auth/AuthScreen';
import { ProfileCompletionModal } from './components/auth/ProfileCompletionModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ReportEmergencyPage } from './pages/ReportEmergencyPage';
import { HospitalsPage } from './pages/HospitalsPage';
import { DashboardPage } from './pages/DashboardPage';
import { HelpPage } from './pages/HelpPage';
import { IncidentDetailPage } from './pages/IncidentDetailPage';
import { ProfilePage } from './pages/ProfilePage';

// 404 Fallback
const NotFoundPage: React.FC = () => (
  <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
    <div className="text-4xl font-mono font-black text-rose-600">404</div>
    <h2 className="text-xl font-bold text-slate-900">Page Not Found</h2>
    <p className="text-xs text-slate-500">
      The requested link does not exist. Please return to the homepage or report an emergency.
    </p>
    <a
      href="/"
      className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
    >
      Return to Home
    </a>
  </div>
);

// Clean App Layout Shell
const AppShell: React.FC = () => {
  const { user, isLoading, needsProfileCompletion } = useAuth();

  // If session is still resolving
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-600 animate-pulse flex items-center justify-center text-white font-bold text-xl">
          ARQ
        </div>
        <div className="text-slate-200 text-sm font-semibold">
          Initializing AutoResQ Emergency Network...
        </div>
      </div>
    );
  }

  // First Screen Requirement: If user is not authenticated, show Login / Sign-up page
  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Compulsory Profile Completion Modal for new users (e.g. Google Sign-In) */}
      {needsProfileCompletion && <ProfileCompletionModal />}

      {/* Top Universal Safety Notice Banner */}
      <SafetyNoticeBanner />

      {/* Main Top Navigation (Only 5 main items + 7-language selector + Profile) */}
      <Navbar />

      {/* Main Page Content Viewport */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report-emergency" element={<ReportEmergencyPage />} />
          <Route path="/hospitals" element={<HospitalsPage />} />
          <Route path="/resources" element={<Navigate to="/hospitals" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <IncidentProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </IncidentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
