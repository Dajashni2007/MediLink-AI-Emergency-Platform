import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { Hospital, Doctor } from '../types';
import { HospitalCard } from '../components/HospitalCard';
import { DoctorCard } from '../components/DoctorCard';
import { QrCode, User, Shield, Calendar, Phone, Bookmark, Heart, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface UserDashboardViewProps {
  hospitals: Hospital[];
  doctors: Doctor[];
  onSelectHospital: (h: Hospital) => void;
  onBookAppointment: (h?: Hospital, d?: Doctor) => void;
  onRequestAmbulance: (h?: Hospital) => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  hospitals,
  doctors,
  onSelectHospital,
  onBookAppointment,
  onRequestAmbulance
}) => {
  const { user, savedHospitalIds, savedDoctorIds } = useAuth();
  const { appointments } = useEmergency();

  const savedHospitalsList = hospitals.filter(h => savedHospitalIds.includes(h.id));
  const savedDoctorsList = doctors.filter(d => savedDoctorIds.includes(d.id));

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Banner */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-red-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {user?.name || 'Guest Patient'}
              </h2>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] rounded">
                VERIFIED PROFILE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {user?.email || 'guest@medilink.org'} • {user?.mobile || '+91 98765 00000'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Blood Group: <strong className="text-red-600">{user?.bloodGroup || 'O+'}</strong> • DOB: {user?.dob || '1995-08-15'}
            </p>
          </div>
        </div>

        {/* Digital Medical Pass QR Code */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center space-x-3 text-xs">
          <QrCode className="w-12 h-12 text-slate-900 dark:text-white shrink-0" />
          <div>
            <p className="font-extrabold text-slate-900 dark:text-white">MediLink Universal Medical Pass</p>
            <p className="text-[10px] text-slate-500">Scan at any hospital emergency counter for instant EHR lookup</p>
          </div>
        </div>
      </div>

      {/* Booked Appointments Section */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center">
          <Calendar className="w-5 h-5 text-blue-600 mr-2" />
          Active Hospital Appointments ({appointments.length})
        </h3>

        {appointments.length === 0 ? (
          <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-2">
            <p className="text-xs text-slate-500">No active hospital appointments booked yet.</p>
            <button
              onClick={() => onBookAppointment()}
              className="px-4 py-2 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow"
            >
              Book Doctor Consultation Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map(apt => (
              <div key={apt.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white">{apt.hospitalName}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded">
                    CONFIRMED
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">Doctor: {apt.doctorName} ({apt.doctorSpecialization})</p>
                <p className="text-slate-500">Date & Slot: <strong>{apt.date} at {apt.timeSlot}</strong></p>
                <p className="text-[10px] text-slate-400">Pass ID: {apt.id}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Hospitals */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center">
          <Bookmark className="w-5 h-5 text-red-600 mr-2" />
          Bookmarked Hospitals ({savedHospitalsList.length})
        </h3>

        {savedHospitalsList.length === 0 ? (
          <p className="text-xs text-slate-500">No bookmarked hospitals. Click the bookmark icon on any hospital card to save it here.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedHospitalsList.map(hospital => (
              <HospitalCard
                key={hospital.id}
                hospital={hospital}
                onSelect={onSelectHospital}
                onBookAppointment={(h) => onBookAppointment(h)}
                onRequestAmbulance={(h) => onRequestAmbulance(h)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Saved Doctors */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center">
          <Heart className="w-5 h-5 text-indigo-600 mr-2" />
          Saved Doctors ({savedDoctorsList.length})
        </h3>

        {savedDoctorsList.length === 0 ? (
          <p className="text-xs text-slate-500">No bookmarked doctors.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDoctorsList.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBookAppointment={(d) => onBookAppointment(undefined, d)}
                onVideoConsult={(d) => alert(`Starting video call with ${d.name}...`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
