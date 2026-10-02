import React, { useState } from 'react';
import { Ambulance } from '../types';
import { useEmergency } from '../context/EmergencyContext';
import { useLocation } from '../context/LocationContext';
import { MapContainer } from './MapContainer';
import { Siren, Phone, ShieldCheck, MapPin, Clock, User, CheckCircle2, ChevronRight } from 'lucide-react';

interface AmbulanceTrackerProps {
  ambulances: Ambulance[];
  onRequestDispatch: (amb?: Ambulance) => void;
}

export const AmbulanceTracker: React.FC<AmbulanceTrackerProps> = ({
  ambulances,
  onRequestDispatch
}) => {
  const { activeSosRequest } = useEmergency();
  const { location } = useLocation();
  const [selectedAmb, setSelectedAmb] = useState<Ambulance | null>(ambulances[0] || null);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-100 dark:bg-red-950 text-red-600 rounded-xl">
              <Siren className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Live Emergency Ambulance Dispatch & GPS Tracking
              </h2>
              <p className="text-xs text-slate-500">
                Paramedic-equipped Advanced Life Support (ALS) & ICU Ambulances near {location.city}
              </p>
            </div>
          </div>
        </div>

        {/* Dispatch Trigger Button */}
        <button
          onClick={() => onRequestDispatch(selectedAmb || undefined)}
          className="px-5 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-red-500/30 flex items-center justify-center space-x-2 transition-all active:scale-95 ring-2 ring-red-400/50"
        >
          <Siren className="w-5 h-5 text-white animate-bounce" />
          <span>REQUEST AMBULANCE NOW</span>
        </button>
      </div>

      {/* Active Active Dispatch Notification Banner if any */}
      {activeSosRequest && (
        <div className="p-4 bg-red-50 dark:bg-red-950/70 border-2 border-red-500 rounded-2xl flex items-center justify-between text-xs animate-pulse">
          <div className="flex items-center space-x-3">
            <Siren className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <p className="font-extrabold text-red-900 dark:text-red-200">
                Ambulance Dispatched! Vehicle #{activeSosRequest.assignedAmbulanceNumber}
              </p>
              <p className="text-red-700 dark:text-red-300 text-[11px]">
                Driver: {activeSosRequest.assignedDriverName} ({activeSosRequest.assignedDriverContact}) • ETA: {activeSosRequest.etaMinutes} mins
              </p>
            </div>
          </div>
          <a
            href={`tel:${activeSosRequest.assignedDriverContact}`}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow shrink-0"
          >
            Call Driver
          </a>
        </div>
      )}

      {/* Grid: Interactive Tracking Map + Fleet List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map View */}
        <div className="lg:col-span-7">
          <MapContainer
            userLocation={location}
            ambulances={ambulances}
            selectedItem={selectedAmb}
            onSelectItem={setSelectedAmb}
            height="h-96"
          />
        </div>

        {/* Fleet List */}
        <div className="lg:col-span-5 space-y-3 overflow-y-auto max-h-96 pr-1">
          <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
            Available Nearby Ambulances ({ambulances.length})
          </h4>

          {ambulances.map(amb => (
            <div
              key={amb.id}
              onClick={() => setSelectedAmb(amb)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedAmb?.id === amb.id
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-500 shadow-md ring-1 ring-red-400'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img src={amb.driverPhoto} alt="" className="w-11 h-11 rounded-2xl object-cover shadow" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-xs text-slate-900 dark:text-white">
                      {amb.vehicleNumber}
                    </span>
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[9px] font-extrabold rounded">
                      {amb.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Driver: {amb.driverName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {amb.hospitalAffiliation}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="block font-black text-red-600 text-sm">{amb.etaMinutes} MINS</span>
                <span className="text-[10px] text-slate-400 font-bold">{amb.distanceKm} km away</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
