import React from 'react';
import { Hospital, Doctor, Pharmacy, Ambulance } from '../types';
import { Shield, Activity, Siren, Hospital as HospitalIcon, Users, CheckCircle2, AlertTriangle, Building, Pill } from 'lucide-react';

interface AdminDashboardViewProps {
  hospitals: Hospital[];
  doctors: Doctor[];
  pharmacies: Pharmacy[];
  ambulances: Ambulance[];
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  hospitals,
  doctors,
  pharmacies,
  ambulances
}) => {
  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-red-600 text-white font-extrabold text-[10px] rounded uppercase">
            NATIONAL SYSTEM ADMIN PANEL
          </span>
          <h2 className="text-xl font-black mt-1">MediLink Emergency Control Tower</h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time oversight of hospital bed capacity, active ambulances, & dispatch telemetry</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-extrabold">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-1 shadow-sm">
          <HospitalIcon className="w-6 h-6 text-blue-600 mb-1" />
          <span className="text-slate-400 font-bold uppercase text-[10px]">Registered Hospitals</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{hospitals.length}</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-1 shadow-sm">
          <Siren className="w-6 h-6 text-red-600 mb-1" />
          <span className="text-slate-400 font-bold uppercase text-[10px]">Active Ambulances</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{ambulances.length}</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-1 shadow-sm">
          <Users className="w-6 h-6 text-teal-600 mb-1" />
          <span className="text-slate-400 font-bold uppercase text-[10px]">Doctors On Duty</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{doctors.length}</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-1 shadow-sm">
          <Pill className="w-6 h-6 text-emerald-600 mb-1" />
          <span className="text-slate-400 font-bold uppercase text-[10px]">Pharmacies Active</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{pharmacies.length}</p>
        </div>
      </div>

      {/* System Health Status */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Live System Node Status</h3>
        <div className="space-y-2 text-xs font-medium">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
            <span>Gemini AI Triage Server Engine (/api/chat)</span>
            <span className="text-emerald-600 font-extrabold flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" /> OPERATIONAL (gemini-3.6-flash)
            </span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
            <span>GPS Emergency SOS Broadcast Relay (/api/emergency/sos)</span>
            <span className="text-emerald-600 font-extrabold flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" /> ONLINE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
