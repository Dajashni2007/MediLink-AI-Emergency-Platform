import React, { useEffect, useState } from 'react';
import { Siren, Shield, Heart, Activity } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onFinish(), 200);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-between p-8 select-none animate-fade-in overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Top Tagline */}
      <div className="pt-8 text-center space-y-1 z-10">
        <span className="px-3 py-1 bg-red-950/80 border border-red-800/80 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full">
          Step 1 • Smart Emergency AI Network
        </span>
      </div>

      {/* Center Animated Logo & Slogan */}
      <div className="flex flex-col items-center text-center space-y-6 z-10 max-w-sm">
        <div className="relative">
          <div className="w-28 h-28 bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-600/40 ring-4 ring-red-500/30 animate-bounce">
            <Siren className="w-14 h-14 text-white animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -right-2 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-lg">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            MediLink <span className="text-red-500">AI</span>
          </h1>
          <p className="text-sm font-semibold text-slate-300 leading-relaxed italic">
            "Your Smart Emergency Healthcare Companion."
          </p>
        </div>

        {/* Features Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
          <span className="px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center gap-1">
            <Activity className="w-3 h-3 text-red-400" /> Live ICU Beds
          </span>
          <span className="px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-400" /> 1-Tap SOS
          </span>
          <span className="px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-400" /> Instant GPS Dispatch
          </span>
        </div>
      </div>

      {/* Bottom Loading Progress & Skip */}
      <div className="w-full max-w-xs space-y-4 text-center z-10 pb-6">
        <div className="space-y-1.5">
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Initializing Emergency System... {progress}%
          </p>
        </div>

        <button
          onClick={onFinish}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-extrabold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          Skip to Application →
        </button>
      </div>
    </div>
  );
};
