import React, { useState } from 'react';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider, useLocation } from './context/LocationContext';
import { EmergencyProvider, useEmergency } from './context/EmergencyContext';

import { Header } from './components/Header';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { AIChatbotDrawer } from './components/AIChatbotDrawer';
import { WelcomeAuthModal } from './components/WelcomeAuthModal';
import { LocationPermissionModal } from './components/LocationPermissionModal';
import { HospitalDetailModal } from './components/HospitalDetailModal';
import { AppointmentModal } from './components/AppointmentModal';
import { AccidentReportModal } from './components/AccidentReportModal';
import { SpecializedSupportModal } from './components/SpecializedSupportModal';
import { PharmacyOrderModal } from './components/PharmacyOrderModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsModal } from './components/SettingsModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';

import { HomeDashboard } from './views/HomeDashboard';
import { UserDashboardView } from './views/UserDashboardView';
import { HospitalDashboardView } from './views/HospitalDashboardView';
import { PharmacyDashboardView } from './views/PharmacyDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AboutContactView } from './views/AboutContactView';

import {
  INITIAL_HOSPITALS,
  INITIAL_DOCTORS,
  INITIAL_PHARMACIES,
  INITIAL_AMBULANCES,
  INITIAL_BLOOD_BANKS,
  INITIAL_DIAGNOSTIC_LABS
} from './data/mockData';

import { Hospital, Doctor, Pharmacy } from './types';

function MainApp() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Navigation View State
  const [activeView, setActiveView] = useState<
    'home' | 'user' | 'hospital' | 'pharmacy' | 'admin' | 'about'
  >('home');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Data Collections State
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(INITIAL_PHARMACIES);

  // Modal Open States
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [pharmacyModalData, setPharmacyModalData] = useState<{
    isOpen: boolean;
    pharmacy: Pharmacy | null;
  }>({ isOpen: false, pharmacy: null });

  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<Hospital | null>(null);

  const [appointmentModalData, setAppointmentModalData] = useState<{
    isOpen: boolean;
    hospital?: Hospital | null;
    doctor?: Doctor | null;
  }>({ isOpen: false });

  const [isAccidentModalOpen, setIsAccidentModalOpen] = useState(false);

  const [specializedModalData, setSpecializedModalData] = useState<{
    isOpen: boolean;
    tab?: 'women' | 'child' | 'senior' | 'donors' | 'organ';
  }>({ isOpen: false });

  const { isAuthModalOpen, closeAuthModal, openAuthModal } = useAuth();

  const handleUpdateHospital = (updated: Partial<Hospital>) => {
    setHospitals(prev =>
      prev.map(h => (h.id === hospitals[0].id ? { ...h, ...updated } : h))
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col">
      {/* Step 1: Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Header Bar */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        onOpenAuth={() => setIsOnboardingOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'home' && (
          <HomeDashboard
            hospitals={hospitals}
            doctors={doctors}
            pharmacies={pharmacies}
            ambulances={INITIAL_AMBULANCES}
            bloodBanks={INITIAL_BLOOD_BANKS}
            diagnosticLabs={INITIAL_DIAGNOSTIC_LABS}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onSelectHospital={(h) => setSelectedHospitalForModal(h)}
            onBookAppointment={(h, d) => setAppointmentModalData({ isOpen: true, hospital: h, doctor: d })}
            onRequestAmbulance={(h) => setIsSosOpen(true)}
            onOrderMedicines={(p) => setPharmacyModalData({ isOpen: true, pharmacy: p })}
            onOpenSos={() => setIsSosOpen(true)}
            onOpenChatbot={() => setIsChatbotOpen(true)}
            onOpenSpecializedModal={(tab) => setSpecializedModalData({ isOpen: true, tab })}
            onOpenAccidentModal={() => setIsAccidentModalOpen(true)}
          />
        )}

        {activeView === 'user' && (
          <UserDashboardView
            hospitals={hospitals}
            doctors={doctors}
            onSelectHospital={(h) => setSelectedHospitalForModal(h)}
            onBookAppointment={(h, d) => setAppointmentModalData({ isOpen: true, hospital: h, doctor: d })}
            onRequestAmbulance={(h) => setIsSosOpen(true)}
          />
        )}

        {activeView === 'hospital' && (
          <HospitalDashboardView
            hospital={hospitals[0]}
            doctors={doctors}
            onUpdateHospital={handleUpdateHospital}
          />
        )}

        {activeView === 'pharmacy' && (
          <PharmacyDashboardView pharmacy={pharmacies[0]} />
        )}

        {activeView === 'admin' && (
          <AdminDashboardView
            hospitals={hospitals}
            doctors={doctors}
            pharmacies={pharmacies}
            ambulances={INITIAL_AMBULANCES}
          />
        )}

        {activeView === 'about' && <AboutContactView />}
      </main>

      {/* Clean Minimalism Bottom Navigation Bar */}
      <nav className="sticky bottom-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 sm:px-12 py-3 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeView === 'home'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </button>

        <button
          onClick={() => setAppointmentModalData({ isOpen: true })}
          className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">Appointments</span>
        </button>

        <button
          onClick={() => setActiveView('user')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeView === 'user'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">Records</span>
        </button>

        <button
          onClick={() => setActiveView('about')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeView === 'about'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">Contacts</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MediLink – AI Smart Emergency Medical Assistance Platform. All Rights Reserved.</p>
          <div className="flex items-center space-x-4 font-bold">
            <button onClick={() => setActiveView('about')} className="hover:text-white">Hotline Directory</button>
            <button onClick={() => setActiveView('about')} className="hover:text-white">Emergency Terms</button>
            <button onClick={() => setActiveView('about')} className="hover:text-white">Privacy Policy</button>
          </div>
        </div>
      </footer>

      {/* Global Modals & Slide-overs */}
      <EmergencySOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      <AIChatbotDrawer
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onOpenSos={() => { setIsChatbotOpen(false); setIsSosOpen(true); }}
        onSearchCategory={(cat) => { setActiveCategory(cat); setActiveView('home'); }}
      />

      <OnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onNavigateToAbout={() => setActiveView('about')}
      />

      <WelcomeAuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />

      <LocationPermissionModal />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onLogout={() => setIsLogoutModalOpen(true)}
      />

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={() => setIsOnboardingOpen(true)}
      />

      <PharmacyOrderModal
        isOpen={pharmacyModalData.isOpen}
        pharmacy={pharmacyModalData.pharmacy}
        onClose={() => setPharmacyModalData({ isOpen: false, pharmacy: null })}
      />

      <HospitalDetailModal
        hospital={selectedHospitalForModal}
        doctors={doctors}
        onClose={() => setSelectedHospitalForModal(null)}
        onBookAppointment={(h, d) => {
          setSelectedHospitalForModal(null);
          setAppointmentModalData({ isOpen: true, hospital: h, doctor: d });
        }}
        onRequestAmbulance={() => {
          setSelectedHospitalForModal(null);
          setIsSosOpen(true);
        }}
      />

      <AppointmentModal
        isOpen={appointmentModalData.isOpen}
        selectedHospital={appointmentModalData.hospital}
        selectedDoctor={appointmentModalData.doctor}
        hospitals={hospitals}
        doctors={doctors}
        onClose={() => setAppointmentModalData({ isOpen: false })}
      />

      <AccidentReportModal
        isOpen={isAccidentModalOpen}
        onClose={() => setIsAccidentModalOpen(false)}
      />

      <SpecializedSupportModal
        isOpen={specializedModalData.isOpen}
        activeTab={specializedModalData.tab}
        onClose={() => setSpecializedModalData({ isOpen: false })}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeLanguageProvider>
      <AuthProvider>
        <LocationProvider>
          <EmergencyProvider>
            <MainApp />
          </EmergencyProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeLanguageProvider>
  );
}
