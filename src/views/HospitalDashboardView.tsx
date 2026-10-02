import React, { useState } from 'react';
import { Hospital, Doctor } from '../types';
import { Bed, Activity, Siren, ShieldCheck, Plus, Minus, CheckCircle2, PhoneCall, Clock, Check, AlertCircle } from 'lucide-react';

interface HospitalDashboardViewProps {
  hospital: Hospital;
  doctors: Doctor[];
  onUpdateHospital: (updated: Partial<Hospital>) => void;
}

export const HospitalDashboardView: React.FC<HospitalDashboardViewProps> = ({
  hospital,
  doctors,
  onUpdateHospital
}) => {
  const [emergencyBeds, setEmergencyBeds] = useState(hospital.emergencyBedsAvailable);
  const [icuBeds, setIcuBeds] = useState(hospital.icuBedsAvailable);
  const [oxygenStatus, setOxygenStatus] = useState(hospital.oxygenAvailable);
  const [bloodBankStatus, setBloodBankStatus] = useState(hospital.bloodBankAvailable);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveStats = () => {
    onUpdateHospital({
      emergencyBedsAvailable: emergencyBeds,
      icuBedsAvailable: icuBeds,
      oxygenAvailable: oxygenStatus,
      bloodBankAvailable: bloodBankStatus
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-red-600 text-white font-extrabold text-[10px] rounded uppercase">
            HOSPITAL EMERGENCY MANAGER PORTAL
          </span>
          <h2 className="text-xl font-black mt-1">{hospital.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{hospital.address} • Reg #HOSP-TN-8802</p>
        </div>

        <button
          onClick={handleSaveStats}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors flex items-center space-x-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Publish Real-Time Bed & ER Updates</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 font-extrabold text-xs rounded-2xl flex items-center space-x-2">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>Hospital real-time availability sync published to live patient search index!</span>
        </div>
      )}

      {/* Real-time Counters Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Emergency Beds Editor */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center space-x-2">
            <Bed className="w-5 h-5 text-red-600" />
            <h4 className="font-extrabold text-slate-900 dark:text-white">Emergency Trauma Beds</h4>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setEmergencyBeds(Math.max(0, emergencyBeds - 1))}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white rounded-xl"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-2xl font-black text-red-600">{emergencyBeds}</span>
            <button
              onClick={() => setEmergencyBeds(emergencyBeds + 1)}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center">Live available trauma beds in ER</p>
        </div>

        {/* ICU Beds Editor */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h4 className="font-extrabold text-slate-900 dark:text-white">ICU Ventilator Beds</h4>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setIcuBeds(Math.max(0, icuBeds - 1))}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white rounded-xl"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-2xl font-black text-indigo-600">{icuBeds} / {hospital.totalIcuBeds}</span>
            <button
              onClick={() => setIcuBeds(icuBeds + 1)}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center">Live ICU beds with ventilator</p>
        </div>

        {/* Oxygen Stock Toggle */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm">
          <h4 className="font-extrabold text-slate-900 dark:text-white">Liquid Medical Oxygen</h4>
          <button
            onClick={() => setOxygenStatus(!oxygenStatus)}
            className={`w-full py-3 font-extrabold rounded-xl transition-colors ${
              oxygenStatus
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {oxygenStatus ? '✓ Stock Plentiful' : '⚠️ Low Stock'}
          </button>
          <p className="text-[10px] text-slate-400 text-center">Toggle status for incoming patients</p>
        </div>

        {/* Blood Bank Toggle */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm">
          <h4 className="font-extrabold text-slate-900 dark:text-white">24x7 Blood Bank Counter</h4>
          <button
            onClick={() => setBloodBankStatus(!bloodBankStatus)}
            className={`w-full py-3 font-extrabold rounded-xl transition-colors ${
              bloodBankStatus
                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {bloodBankStatus ? '✓ Blood Bank Operational' : 'Offline'}
          </button>
          <p className="text-[10px] text-slate-400 text-center">In-house blood bank operational</p>
        </div>
      </div>

      {/* Incoming SOS & Dispatch Requests queue */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <div className="flex items-center space-x-2">
          <Siren className="w-5 h-5 text-red-600 animate-pulse" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Incoming Live Emergency SOS Requests Queue
          </h3>
        </div>

        <div className="p-4 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[10px] rounded uppercase mr-2">
              CRITICAL SOS
            </span>
            <strong className="text-red-900 dark:text-red-200">Polytrauma Patient Request</strong>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
              Location: Greams Road Signal • ETA: 4 Mins • Assigned Vehicle: TN-01-AX-1081
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow">
              Prepare ER Bay 1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
