import React from 'react';
import { Hospital, Doctor } from '../types';
import { MapContainer } from './MapContainer';
import {
  Hospital as HospitalIcon,
  Phone,
  Navigation,
  Calendar,
  Siren,
  Mail,
  Globe,
  MessageSquare,
  Bed,
  Activity,
  UserCheck,
  Clock,
  Star,
  X,
  Building,
  Check
} from 'lucide-react';

interface HospitalDetailModalProps {
  hospital: Hospital | null;
  doctors: Doctor[];
  onClose: () => void;
  onBookAppointment: (h: Hospital, d?: Doctor) => void;
  onRequestAmbulance: (h: Hospital) => void;
}

export const HospitalDetailModal: React.FC<HospitalDetailModalProps> = ({
  hospital,
  doctors,
  onClose,
  onBookAppointment,
  onRequestAmbulance
}) => {
  if (!hospital) return null;

  const hospitalDoctors = doctors.filter(d => d.hospitalId === hospital.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Banner */}
        <div className="relative h-52 w-full bg-slate-900 shrink-0">
          <img src={hospital.photo} alt={hospital.name} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
            <div className="flex items-center space-x-3">
              <img src={hospital.logo} alt="" className="w-14 h-14 rounded-2xl bg-white p-1 shadow" />
              <div>
                <span className="px-2.5 py-0.5 rounded-lg bg-red-600 text-[10px] font-black uppercase tracking-wider">
                  {hospital.type} Hospital
                </span>
                <h2 className="text-xl font-black mt-1 leading-tight">{hospital.name}</h2>
                <p className="text-xs text-slate-300 flex items-center mt-0.5">
                  <Building className="w-3.5 h-3.5 mr-1" /> {hospital.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl">
              <Bed className="w-5 h-5 text-red-600 mb-1" />
              <p className="text-[10px] text-slate-500 font-bold uppercase">Emergency Beds</p>
              <p className="text-base font-black text-slate-900 dark:text-white">{hospital.emergencyBedsAvailable} Available</p>
            </div>

            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 rounded-2xl">
              <Activity className="w-5 h-5 text-indigo-600 mb-1" />
              <p className="text-[10px] text-slate-500 font-bold uppercase">ICU Beds Available</p>
              <p className="text-base font-black text-slate-900 dark:text-white">{hospital.icuBedsAvailable} / {hospital.totalIcuBeds}</p>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-2xl">
              <UserCheck className="w-5 h-5 text-blue-600 mb-1" />
              <p className="text-[10px] text-slate-500 font-bold uppercase">Doctors On Duty Today</p>
              <p className="text-base font-black text-slate-900 dark:text-white">{hospital.doctorsTodayCount} Specialists</p>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-2xl">
              <Clock className="w-5 h-5 text-emerald-600 mb-1" />
              <p className="text-[10px] text-slate-500 font-bold uppercase">Est. ER Wait Time</p>
              <p className="text-base font-black text-slate-900 dark:text-white">~{hospital.estWaitingTimeMin} mins</p>
            </div>
          </div>

          {/* Departments List */}
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">
              Medical Departments & Centers of Excellence
            </h4>
            <div className="flex flex-wrap gap-2">
              {hospital.departments.map((dept, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  ✓ {dept}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Channels Grid */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <h4 className="font-extrabold text-slate-900 dark:text-white">Contact & Emergency Desks</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
              <p className="flex items-center text-slate-700 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 mr-2 text-red-600" /> Emergency: <strong className="ml-1">{hospital.emergencyNumber}</strong>
              </p>
              <p className="flex items-center text-slate-700 dark:text-slate-300">
                <MessageSquare className="w-3.5 h-3.5 mr-2 text-emerald-600" /> WhatsApp: <strong className="ml-1">{hospital.whatsappNumber}</strong>
              </p>
              <p className="flex items-center text-slate-700 dark:text-slate-300 truncate">
                <Mail className="w-3.5 h-3.5 mr-2 text-blue-600 shrink-0" /> {hospital.email}
              </p>
              <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                <Globe className="w-3.5 h-3.5 mr-2" /> Official Website
              </a>
            </div>
          </div>

          {/* Doctors Available Today Section */}
          {hospitalDoctors.length > 0 && (
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">
                Doctors On Duty Today at {hospital.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hospitalDoctors.map(doc => (
                  <div key={doc.id} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={doc.photo} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">{doc.name}</p>
                        <p className="text-[11px] text-slate-500">{doc.specialization}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onBookAppointment(hospital, doc)}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Hospital Map */}
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">Live Map & Navigation</h4>
            <MapContainer
              userLocation={{ latitude: hospital.lat, longitude: hospital.lng, address: hospital.address }}
              hospitals={[hospital]}
              height="h-56"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs font-extrabold">
          <a
            href={`tel:${hospital.emergencyNumber}`}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-center shadow flex items-center justify-center space-x-1"
          >
            <Phone className="w-4 h-4" />
            <span>Call ER ({hospital.emergencyNumber})</span>
          </a>

          <button
            onClick={() => onBookAppointment(hospital)}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow flex items-center justify-center space-x-1"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>

          <button
            onClick={() => onRequestAmbulance(hospital)}
            className="py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow flex items-center space-x-1"
          >
            <Siren className="w-4 h-4" />
            <span>Request Ambulance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
