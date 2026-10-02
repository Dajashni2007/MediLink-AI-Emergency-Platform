import React from 'react';
import { LogOut, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout
}) => {
  const { logout } = useAuth();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onConfirmLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-center space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow">
          <LogOut className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Sign Out of MediLink</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Are you sure you want to log out? Your session data will be cleared and you will return to the welcome portal.
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleLogout}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
          >
            Yes, Log Out
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
