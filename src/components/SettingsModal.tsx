import React, { useState } from 'react';
import { X, Moon, Sun, Globe, Bell, Shield, Trash2, Sliders, Check } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onLogout }) => {
  const { theme, toggleTheme, language, setLanguage } = useThemeLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleDeleteAccount = () => {
    alert('Account deleted successfully. Returning to onboarding...');
    setShowDeleteConfirm(false);
    onClose();
    if (onLogout) onLogout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">

        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-blue-500" />
            <h3 className="font-black text-base">Application Settings</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-800 dark:text-slate-200">

          {/* Dark Mode */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Dark Visual Theme</p>
                <p className="text-[10px] text-slate-500">Reduce eye strain during night emergency usage</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Language Selector */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>Preferred Interface Language</span>
            </div>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as any)}
              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs"
            >
              <option value="en">English (US / IN)</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="kn">Kannada (ಕನ್ನಡ)</option>
              <option value="ta">Tamil (தமிழ்)</option>
              <option value="es">Spanish (Español)</option>
            </select>
          </div>

          {/* Notification Preferences */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Push Notifications</p>
                <p className="text-[10px] text-slate-500">Ambulance ETA and appointment alerts</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 ${notificationsEnabled ? 'bg-red-600' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Privacy & Location Sharing */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Emergency Location Sharing</p>
                <p className="text-[10px] text-slate-500">Broadcast live GPS during 1-Tap SOS</p>
              </div>
            </div>
            <button
              onClick={() => setLocationSharing(!locationSharing)}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 ${locationSharing ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${locationSharing ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Delete Account */}
          <div className="pt-2">
            {showDeleteConfirm ? (
              <div className="p-4 bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-900 rounded-2xl space-y-2 text-red-700 dark:text-red-300">
                <p className="font-black">Are you sure you want to permanently delete your medical profile?</p>
                <p className="text-[10px]">All saved records, appointments, and emergency pass keys will be removed.</p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 py-2 bg-red-600 text-white font-extrabold rounded-xl"
                  >
                    Yes, Delete Profile
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 bg-red-50 dark:bg-red-950/30 text-red-600 border border-red-200 dark:border-red-900 font-extrabold rounded-xl flex items-center justify-center space-x-2 hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Profile & Records</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
