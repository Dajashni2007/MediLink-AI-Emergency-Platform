import React, { useState, useEffect } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { Siren, PhoneCall, Send, MapPin, Ambulance, Hospital, ShieldCheck, X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose }) => {
  const { triggerSOS, cancelSOS, activeSosRequest } = useEmergency();
  const { user } = useAuth();
  const { location } = useLocation();

  const [countdown, setCountdown] = useState<number>(3);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(true);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && isCountingDown && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isOpen && isCountingDown && countdown === 0) {
      setIsCountingDown(false);
      handleActivateSos();
    }
    return () => clearTimeout(timer);
  }, [isOpen, isCountingDown, countdown]);

  const handleActivateSos = async () => {
    setIsDispatched(true);
    await triggerSOS('High-Priority Medical SOS Alert');

    // Play synthesized emergency alert tone
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch (e) {
        // Audio context fallback
      }
    }
  };

  const handleStopAndCancel = () => {
    cancelSOS();
    setIsCountingDown(false);
    setIsDispatched(false);
    setCountdown(3);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-red-600 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header Alert Strip */}
        <div className="bg-red-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Siren className="w-6 h-6 animate-pulse" />
            <span className="font-extrabold text-base tracking-wide uppercase">
              🚨 CRITICAL EMERGENCY SOS ACTIVATION
            </span>
          </div>
          <button
            onClick={handleStopAndCancel}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-6 flex flex-col items-center text-center space-y-6">
          {/* Countdown State */}
          {isCountingDown ? (
            <div className="flex flex-col items-center space-y-4 my-4">
              <div className="relative flex items-center justify-center">
                <div className="w-28 h-28 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
                <span className="absolute text-5xl font-black text-red-600 dark:text-red-500 animate-pulse">
                  {countdown}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Dispatching Emergency Response Team in {countdown} seconds...
              </p>
              <button
                onClick={handleStopAndCancel}
                className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel Immediate Trigger
              </button>
            </div>
          ) : (
            /* Dispatched Active Emergency Summary */
            <div className="w-full space-y-5 text-left">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-sm text-emerald-900 dark:text-emerald-200">
                    Emergency Alert Dispatched Successfully
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Live location shared with Apollo Emergency Trauma Center and nearest dispatch hub.
                  </p>
                </div>
              </div>

              {/* Status Details Grid */}
              <div className="space-y-3 text-xs">
                {/* 1. Live Location Shared */}
                <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Live Location Shared</p>
                      <p className="text-slate-500 text-[11px]">{location.address}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] rounded">
                    BROADCASTING
                  </span>
                </div>

                {/* 2. Dispatched Ambulance Info */}
                <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Ambulance className="w-4 h-4 text-red-600" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">ICU Ambulance Dispatched</p>
                      <p className="text-slate-500 text-[11px]">
                        Vehicle: TN-01-AX-1081 • EMT: Senthil Kumar
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-red-600 text-sm">ETA 4 MINS</span>
                  </div>
                </div>

                {/* 3. Emergency Contact Notification Payload */}
                <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Send className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Family Contact Notified</p>
                      <p className="text-slate-500 text-[11px]">
                        SMS sent to {user?.emergencyContactName || 'Sarah Morgan'} ({user?.emergencyContactNumber || '+91 98765 00001'})
                      </p>
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>

                {/* 4. Trauma Center Contact */}
                <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Hospital className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Apollo Emergency Trauma Room</p>
                      <p className="text-slate-500 text-[11px]">Emergency Line: 1066 / +91 44 2829 0200</p>
                    </div>
                  </div>
                  <a
                    href="tel:1066"
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-lg flex items-center shadow"
                  >
                    <PhoneCall className="w-3.5 h-3.5 mr-1" /> Call Room
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center space-x-3">
                <a
                  href="tel:112"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs text-center rounded-xl shadow-lg flex items-center justify-center space-x-1.5"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call National Emergency (112)</span>
                </a>
                <button
                  onClick={handleStopAndCancel}
                  className="px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Stand Down / Resolve
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
