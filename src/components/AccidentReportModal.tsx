import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { useEmergency } from '../context/EmergencyContext';
import { AlertTriangle, Camera, MapPin, Send, Siren, CheckCircle2, X } from 'lucide-react';

interface AccidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccidentReportModal: React.FC<AccidentReportModalProps> = ({ isOpen, onClose }) => {
  const { location } = useLocation();
  const { triggerSOS, addNotification } = useEmergency();

  const [description, setDescription] = useState('Traffic vehicle accident with injury needing trauma ambulance');
  const [injuriesCount, setInjuriesCount] = useState('1');
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&w=600&q=80'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await triggerSOS(`ACCIDENT REPORT: ${description} (${injuriesCount} injured) at ${location.address}`);
    addNotification(
      '🚨 Accident Dispatch Activated',
      `Polytrauma response dispatched to ${location.address}. Police & Trauma Team notified.`,
      'emergency'
    );
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-amber-500 rounded-3xl shadow-2xl overflow-hidden p-6 text-xs">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Report Medical / Road Accident
                </h3>
                <p className="text-[11px] text-slate-500">
                  Instant location broadcast to nearest polytrauma & highway rescue units
                </p>
              </div>
            </div>

            {/* GPS Location Auto Pin */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Accident Location</p>
                  <p className="text-slate-500 text-[11px]">{location.address}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-600 font-bold text-[10px] rounded">
                LIVE GPS PIN
              </span>
            </div>

            {/* Description & Severity */}
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                Accident Details & Vehicle Types
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Injured Persons Count
                </label>
                <select
                  value={injuriesCount}
                  onChange={e => setInjuriesCount(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="1">1 Person Injured</option>
                  <option value="2">2 Persons Injured</option>
                  <option value="3+">3 or More Injured (Mass Casualty)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Attach Photo (Optional)
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                    {photoPreview ? (
                      <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-5 h-5 text-slate-400 m-2.5" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Site photo attached</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
            >
              <Siren className="w-4 h-4" />
              <span>DISPATCH HIGHWAY TRAUMA & AMBULANCE NOW</span>
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Accident Emergency Broadcast Active
              </h3>
              <p className="text-xs text-slate-500">
                Nearest Polytrauma Hospital and Police Highway Patrol alerted. ICU Ambulance en route.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold rounded-xl"
            >
              Close Alert
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
