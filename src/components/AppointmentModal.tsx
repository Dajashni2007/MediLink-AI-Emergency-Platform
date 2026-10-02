import React, { useState } from 'react';
import { Hospital, Doctor } from '../types';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, Phone, CheckCircle2, X, QrCode, Hospital as HospitalIcon } from 'lucide-react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHospital?: Hospital | null;
  selectedDoctor?: Doctor | null;
  hospitals: Hospital[];
  doctors: Doctor[];
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedHospital,
  selectedDoctor,
  hospitals,
  doctors
}) => {
  const { bookAppointment } = useEmergency();
  const { user } = useAuth();

  const [hospitalId, setHospitalId] = useState<string>(selectedHospital?.id || hospitals[0]?.id || '');
  const [doctorId, setDoctorId] = useState<string>(selectedDoctor?.id || doctors[0]?.id || '');
  const [date, setDate] = useState<string>('2026-07-28');
  const [timeSlot, setTimeSlot] = useState<string>('10:30 AM');
  const [patientName, setPatientName] = useState<string>(user?.name || '');
  const [patientMobile, setPatientMobile] = useState<string>(user?.mobile || '');
  const [reason, setReason] = useState<string>('General Medical Evaluation & Consultation');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [confirmedAptId, setConfirmedAptId] = useState<string>('');

  if (!isOpen) return null;

  const currentHospital = hospitals.find(h => h.id === hospitalId) || selectedHospital || hospitals[0];
  const currentDoctor = doctors.find(d => d.id === doctorId) || selectedDoctor || doctors[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apt = await bookAppointment({
      hospitalId: currentHospital?.id || 'h1',
      hospitalName: currentHospital?.name || 'Apollo Hospital',
      doctorId: currentDoctor?.id || 'd1',
      doctorName: currentDoctor?.name || 'Dr. Rajesh Subramanian',
      doctorSpecialization: currentDoctor?.specialization || 'Cardiologist',
      date,
      timeSlot,
      patientName: patientName || 'Patient',
      patientMobile: patientMobile || '+91 98765 43210',
      reason
    });

    setConfirmedAptId(apt.id);
    setIsConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        {!isConfirmed ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Book Doctor Consultation
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select hospital, specialist, date, and preferred time slot
                </p>
              </div>
            </div>

            {/* Hospital Selection */}
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                Select Hospital
              </label>
              <select
                value={hospitalId}
                onChange={e => setHospitalId(e.target.value)}
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              >
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                Select Specialist Doctor
              </label>
              <select
                value={doctorId}
                onChange={e => setDoctorId(e.target.value)}
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialization}) - ₹{d.consultationFee}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Slot Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:45 AM">11:45 AM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="06:15 PM">06:15 PM</option>
                </select>
              </div>
            </div>

            {/* Patient Name & Mobile */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  required
                  placeholder="Alex Morgan"
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Patient Mobile Number
                </label>
                <input
                  type="tel"
                  value={patientMobile}
                  onChange={e => setPatientMobile(e.target.value)}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                Reason / Chief Complaint
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors mt-2"
            >
              Confirm Booking & Generate Hospital Pass →
            </button>
          </form>
        ) : (
          /* Confirmation Pass Screen */
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Appointment Confirmed!
              </h3>
              <p className="text-xs text-slate-500">
                Hospital Check-In Pass generated for instant counter entry
              </p>
            </div>

            {/* QR Pass Box */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-sm mx-auto space-y-3">
              <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto shadow flex items-center justify-center">
                {/* SVG QR Code Graphic */}
                <QrCode className="w-28 h-28 text-slate-900" />
              </div>
              <p className="text-[10px] font-mono font-bold text-slate-500">
                PASS ID: {confirmedAptId}
              </p>

              <div className="text-left text-xs space-y-1 pt-1 border-t border-slate-200 dark:border-slate-700 font-medium">
                <p><strong>Hospital:</strong> {currentHospital?.name}</p>
                <p><strong>Doctor:</strong> {currentDoctor?.name}</p>
                <p><strong>Date & Time:</strong> {date} at {timeSlot}</p>
                <p><strong>Patient:</strong> {patientName} ({patientMobile})</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs rounded-xl shadow"
            >
              Done / Close Pass
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
