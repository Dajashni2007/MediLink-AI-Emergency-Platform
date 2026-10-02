import React from 'react';
import { Doctor } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  UserCheck,
  Star,
  Phone,
  Calendar,
  Video,
  Bookmark,
  Building,
  Clock,
  Globe
} from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (d: Doctor) => void;
  onVideoConsult: (d: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onBookAppointment,
  onVideoConsult
}) => {
  const { savedDoctorIds, toggleSaveDoctor } = useAuth();
  const isSaved = savedDoctorIds.includes(doctor.id);

  const getStatusBadge = () => {
    switch (doctor.status) {
      case 'available':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl font-extrabold text-[10px] flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> Available
          </span>
        );
      case 'busy':
        return (
          <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-xl font-extrabold text-[10px] flex items-center">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" /> Busy
          </span>
        );
      case 'unavailable':
      default:
        return (
          <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded-xl font-extrabold text-[10px] flex items-center">
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5" /> Not Available
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-start space-x-3.5">
        <div className="relative shrink-0">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-16 h-16 rounded-2xl object-cover shadow border border-slate-200 dark:border-slate-700"
          />
          <button
            onClick={() => toggleSaveDoctor(doctor.id)}
            className={`absolute -top-1.5 -right-1.5 p-1 rounded-full text-xs shadow transition-colors ${
              isSaved ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
              {doctor.name}
            </h3>
            {getStatusBadge()}
          </div>

          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
            {doctor.specialization}
          </p>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {doctor.qualification} • {doctor.experienceYears} Years Exp.
          </p>

          <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-1">
            <span className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-500 mr-1" /> {doctor.rating} ({doctor.reviewsCount})
            </span>
            <span>• Fee: ₹{doctor.consultationFee}</span>
          </div>
        </div>
      </div>

      {/* Hospital Affiliation & Slot */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
        <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center truncate">
          <Building className="w-3.5 h-3.5 mr-1.5 text-blue-500 shrink-0" />
          {doctor.hospitalName}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1.5 text-emerald-500 shrink-0" />
          Next Slot: <strong className="ml-1 text-slate-700 dark:text-slate-300">{doctor.nextAvailableSlot}</strong>
        </p>
      </div>

      {/* Languages Spoken */}
      <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500">
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <span>Spoken: {doctor.languagesSpoken.join(', ')}</span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2 text-xs font-extrabold pt-1">
        <button
          onClick={() => onBookAppointment(doctor)}
          className="py-2.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow flex items-center justify-center space-x-1 transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book</span>
        </button>

        <a
          href={`tel:${doctor.contactNumber}`}
          className="py-2.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl flex items-center justify-center space-x-1 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-500" />
          <span>Call</span>
        </a>

        <button
          onClick={() => onVideoConsult(doctor)}
          className="py-2.5 px-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-xl flex items-center justify-center space-x-1 transition-colors border border-indigo-200 dark:border-indigo-800"
        >
          <Video className="w-3.5 h-3.5 text-indigo-500" />
          <span>Video</span>
        </button>
      </div>
    </div>
  );
};
