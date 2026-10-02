import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useEmergency } from '../context/EmergencyContext';
import {
  Siren,
  MapPin,
  Search,
  Mic,
  MicOff,
  Bell,
  Sun,
  Moon,
  Globe,
  User,
  Shield,
  Hospital,
  Pill,
  ChevronDown,
  PhoneCall,
  Sparkles,
  SlidersHorizontal,
  Sliders,
  LogOut,
  X
} from 'lucide-react';

interface HeaderProps {
  activeView: 'home' | 'user' | 'hospital' | 'pharmacy' | 'admin' | 'about';
  setActiveView: (view: 'home' | 'user' | 'hospital' | 'pharmacy' | 'admin' | 'about') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenSos: () => void;
  onOpenChatbot: () => void;
  onOpenAuth: () => void;
  onOpenNotifications?: () => void;
  onOpenSettings?: () => void;
  onOpenLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  onOpenSos,
  onOpenChatbot,
  onOpenAuth,
  onOpenNotifications = () => {},
  onOpenSettings = () => {},
  onOpenLogout = () => {},
}) => {
  const { user, isAuthenticated, switchRole } = useAuth();
  const { location, openPermissionModal, radiusKm, setRadiusKm } = useLocation();
  const { theme, toggleTheme, language, setLanguage, t } = useThemeLanguage();
  const { unreadCount } = useEmergency();

  const [isListening, setIsListening] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Web Speech Voice Search & Emergency Voice Command handler
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setSearchQuery(transcript);

      // Emergency trigger check
      const lower = transcript.toLowerCase();
      if (lower.includes('emergency') || lower.includes('sos') || lower.includes('ambulance') || lower.includes('அவசரம்')) {
        onOpenSos();
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Emergency Emergency Banner / Helpline Strip */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs py-1 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3 overflow-hidden">
          <span className="font-extrabold flex items-center tracking-wider bg-white/20 px-2 py-0.5 rounded text-[11px]">
            <Siren className="w-3.5 h-3.5 mr-1 animate-pulse" /> 24/7 EMERGENCY HELPLINE
          </span>
          <span className="hidden sm:inline-block font-medium">National Emergency: <strong className="underline">112</strong></span>
          <span className="hidden md:inline-block font-medium">• Ambulance: <strong className="underline">108</strong></span>
          <span className="hidden lg:inline-block font-medium">• Women Support: <strong className="underline">1091</strong></span>
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-semibold">
          <button
            onClick={onOpenChatbot}
            className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded transition-all"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI Health Assistant</span>
          </button>
          <a href="tel:108" className="hover:underline flex items-center">
            <PhoneCall className="w-3 h-3 mr-1" /> Call 108
          </a>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              <Siren className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">MediLink</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">AI Emergency Network</p>
            </div>
          </button>

          {/* Location Badge */}
          <button
            onClick={openPermissionModal}
            className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200/80 transition-colors"
          >
            <MapPin className="w-4 h-4 text-slate-500 mr-2" />
            <span className="max-w-[130px] truncate">{location.city}</span>
            <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live Location Sync"></span>
          </button>
        </div>

        {/* Global Search Bar with Voice Control */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-20 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-12 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleVoiceSearch}
              title="Voice Search or Emergency Voice Command"
              className={`absolute right-2 p-1.5 rounded-lg text-xs transition-colors ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Controls & Emergency SOS Button */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* 🚨 Emergency SOS Button */}
          <button
            onClick={onOpenSos}
            className="relative group overflow-hidden px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-lg shadow-red-500/40 hover:shadow-red-500/60 active:scale-95 transition-all flex items-center space-x-1.5 ring-2 ring-red-500/50 animate-pulse"
          >
            <Siren className="w-4 h-4 text-white" />
            <span className="tracking-wide uppercase font-black">{t.sosButton}</span>
          </button>

          {/* AI Health Assistant Drawer Trigger */}
          <button
            onClick={onOpenChatbot}
            title="Open AI Health Assistant"
            className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 rounded-xl transition-colors hidden sm:flex items-center space-x-1"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold hidden lg:inline">AI Doctor</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Language Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1 text-xs font-bold"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{language}</span>
            </button>
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs font-medium">
                <button
                  onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 ${language === 'en' ? 'font-bold text-red-600' : ''}`}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => { setLanguage('ta'); setIsLangMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 ${language === 'ta' ? 'font-bold text-red-600' : ''}`}
                >
                  🇮🇳 தமிழ் (Tamil)
                </button>
                <button
                  onClick={() => { setLanguage('hi'); setIsLangMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 ${language === 'hi' ? 'font-bold text-red-600' : ''}`}
                >
                  🇮🇳 हिंदी (Hindi)
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile / Role Switcher Menu */}
          <div className="relative">
            {isAuthenticated ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-1.5 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity"
              >
                Login
              </button>
            )}

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-extrabold text-[10px] rounded uppercase">
                    Role: {user?.role}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { setActiveView('user'); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center"
                  >
                    <User className="w-4 h-4 mr-2 text-blue-500" /> User Profile & Records
                  </button>
                  <button
                    onClick={() => { onOpenSettings(); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center"
                  >
                    <Sliders className="w-4 h-4 mr-2 text-indigo-500" /> App Settings
                  </button>
                  <button
                    onClick={() => { setActiveView('about'); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center"
                  >
                    <Shield className="w-4 h-4 mr-2 text-emerald-500" /> Emergency Hotline & Info
                  </button>
                  <button
                    onClick={() => { onOpenLogout(); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center font-bold"
                  >
                    <LogOut className="w-4 h-4 mr-2 text-red-500" /> Logout
                  </button>
                </div>

                {/* Role Switcher Section for Testing Portals */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                  <p className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Portal View
                  </p>
                  <button
                    onClick={() => { switchRole('user'); setActiveView('home'); setIsUserMenuOpen(false); }}
                    className={`w-full text-left px-4 py-1.5 flex items-center ${user?.role === 'user' ? 'bg-red-50 dark:bg-red-950/40 font-bold text-red-600' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    <User className="w-3.5 h-3.5 mr-2" /> Patient View
                  </button>
                  <button
                    onClick={() => { switchRole('hospital'); setActiveView('hospital'); setIsUserMenuOpen(false); }}
                    className={`w-full text-left px-4 py-1.5 flex items-center ${user?.role === 'hospital' ? 'bg-red-50 dark:bg-red-950/40 font-bold text-red-600' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    <Hospital className="w-3.5 h-3.5 mr-2" /> Hospital Manager Portal
                  </button>
                  <button
                    onClick={() => { switchRole('pharmacy'); setActiveView('pharmacy'); setIsUserMenuOpen(false); }}
                    className={`w-full text-left px-4 py-1.5 flex items-center ${user?.role === 'pharmacy' ? 'bg-red-50 dark:bg-red-950/40 font-bold text-red-600' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    <Pill className="w-3.5 h-3.5 mr-2" /> Medical Shop Portal
                  </button>
                  <button
                    onClick={() => { switchRole('admin'); setActiveView('admin'); setIsUserMenuOpen(false); }}
                    className={`w-full text-left px-4 py-1.5 flex items-center ${user?.role === 'admin' ? 'bg-red-50 dark:bg-red-950/40 font-bold text-red-600' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 mr-2" /> System Admin Panel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-10 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          />
          <button
            onClick={handleVoiceSearch}
            className="absolute right-2 p-1 text-slate-500"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
