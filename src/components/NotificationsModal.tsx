import React, { useState } from 'react';
import { X, Bell, Siren, Calendar, CheckCircle2, AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Ambulance Unit ALS-102 En Route',
    message: 'Advanced Life Support Ambulance assigned and moving towards your GPS location. ETA: 4 mins.',
    type: 'ambulance',
    timestamp: '10 mins ago',
    read: false
  },
  {
    id: 'n2',
    title: 'Appointment Reminder: Dr. Sarah Jenkins',
    message: 'Your Cardiology consultation at Apollo Medical Center is scheduled for today at 2:30 PM.',
    type: 'appointment',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: 'n3',
    title: 'Hospital ICU Bed Released',
    message: 'Fortis Healthcare updated: 2 new ICU Ventilator beds are now available in emergency ward.',
    type: 'system',
    timestamp: '3 hours ago',
    read: true
  },
  {
    id: 'n4',
    title: 'Blood Donation Camp Alert',
    message: 'Blood Bank O+ and A- units required urgently at General Hospital Red Cross Wing.',
    type: 'emergency',
    timestamp: 'Yesterday',
    read: true
  }
];

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="font-black text-base">Notifications Center</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions Bar */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
          <button onClick={markAllRead} className="text-blue-600 dark:text-blue-400 hover:underline">
            Mark all as read
          </button>
          <button onClick={clearAll} className="text-slate-500 hover:text-red-500 flex items-center gap-1">
            <Trash2 className="w-3 h-3" /> Clear all
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-xs text-slate-500">No new notifications</p>
            </div>
          ) : (
            notifications.map(item => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-colors text-xs space-y-1 ${
                  item.read
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    : 'bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-slate-900 dark:text-white font-medium'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold flex items-center gap-1.5 text-red-600 dark:text-red-400">
                    {item.type === 'ambulance' && <Siren className="w-4 h-4 text-red-500" />}
                    {item.type === 'appointment' && <Calendar className="w-4 h-4 text-blue-500" />}
                    {item.type === 'system' && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                    {item.type === 'emergency' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{item.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
