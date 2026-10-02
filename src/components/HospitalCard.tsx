import React from 'react';
import { Hospital } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Hospital as HospitalIcon,
  Phone,
  Navigation,
  Calendar,
  Siren,
  Bookmark,
  Star,
  CheckCircle2,
  XCircle,
  Activity,
  Bed,
  ShieldCheck,
  Building,
  Clock,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
  onSelect: (h: Hospital) => void;
  onBookAppointment: (h: Hospital) => void;
  onRequestAmbulance: (h: Hospital) => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  onSelect,
  onBookAppointment,
  onRequestAmbulance
}) => {
  const { savedHospitalIds, toggleSaveHospital } = useAuth();
  const isSaved = savedHospitalIds.includes(hospital.id);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Top Banner Image & Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={hospital.photo}
          alt={hospital.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`px-2.5 py-1 rounded-xl font-black text-[10px] uppercase shadow-md backdrop-blur-md ${
              hospital.type === 'Government'
                ? 'bg-indigo-600/90 text-white'
                : 'bg-emerald-600/90 text-white'
            }`}
          >
            {hospital.type} Hospital
          </span>

          <button
            onClick={() => toggleSaveHospital(hospital.id)}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow ${
              isSaved
                ? 'bg-red-600 text-white'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Bottom Image Overlay Details */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow overflow-hidden shrink-0">
              <img src={hospital.logo} alt="" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <span className="text-xs font-bold bg-black/50 px-2 py-0.5 rounded-md backdrop-blur flex items-center w-fit">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" />
                {hospital.rating} ({hospital.reviewsCount} reviews)
              </span>
            </div>
          </div>

          <span className="text-xs font-extrabold bg-blue-600 px-2.5 py-1 rounded-xl shadow">
            {hospital.distanceKm} km away
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onSelect(hospital)}
              className="text-base font-black text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors leading-snug"
            >
              {hospital.name}
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
            <Building className="w-3.5 h-3.5 mr-1 shrink-0 text-slate-400" />
            {hospital.address}
          </p>

          {/* Operating Hours & Emergency Tag */}
          <div className="flex items-center space-x-3 text-[11px] font-semibold mt-2">
            <span className="flex items-center text-emerald-600 dark:text-emerald-400">
              <Clock className="w-3.5 h-3.5 mr-1" /> {hospital.openingHours}
            </span>
            {hospital.emergencyAvailable && (
              <span className="flex items-center text-red-600 dark:text-red-400 font-extrabold">
                <Siren className="w-3.5 h-3.5 mr-1 animate-pulse" /> 24x7 Emergency Room
              </span>
            )}
          </div>
        </div>

        {/* Real-Time Facility Counters Grid */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <Bed className="w-4 h-4 text-red-600 shrink-0" />
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Emergency Beds</span>
              <span className="font-black text-slate-900 dark:text-white">{hospital.emergencyBedsAvailable} Available</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">ICU Beds</span>
              <span className="font-black text-slate-900 dark:text-white">{hospital.icuBedsAvailable} / {hospital.totalIcuBeds}</span>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
          {hospital.oxygenAvailable && (
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg">
              ✓ Oxygen Ready
            </span>
          )}
          {hospital.bloodBankAvailable && (
            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-lg">
              ✓ Blood Bank
            </span>
          )}
          {hospital.pharmacyAvailable && (
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg">
              ✓ 24x7 Pharmacy
            </span>
          )}
        </div>

        {/* Action Buttons Grid */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-extrabold">
          <a
            href={`tel:${hospital.emergencyNumber || hospital.contactNumber}`}
            className="py-2.5 px-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow flex items-center justify-center space-x-1 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call</span>
          </a>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl flex items-center justify-center space-x-1 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-500" />
            <span>Map</span>
          </a>

          <button
            onClick={() => onBookAppointment(hospital)}
            className="py-2.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow flex items-center justify-center space-x-1 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book</span>
          </button>

          <button
            onClick={() => onRequestAmbulance(hospital)}
            className="py-2.5 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow flex items-center justify-center space-x-1 transition-colors"
          >
            <Siren className="w-3.5 h-3.5" />
            <span>Ambulance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
