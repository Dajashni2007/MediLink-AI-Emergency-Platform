import React from 'react';
import { useLocation } from '../context/LocationContext';
import { MapPin, Navigation, Compass, CheckCircle2, X } from 'lucide-react';

export const LocationPermissionModal: React.FC = () => {
  const {
    location,
    showPermissionModal,
    closePermissionModal,
    requestLocationPermission,
    radiusKm,
    setRadiusKm,
    setManualCity,
    isLoadingLocation
  } = useLocation();

  if (!showPermissionModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-center space-y-5">
        <button
          onClick={closePermissionModal}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <MapPin className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Enable Live GPS Location
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Allow location access to instantly find nearby hospitals, ambulances, pharmacies, and trauma services within your emergency radius.
          </p>
        </div>

        {/* Current Location Badge */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-left border border-slate-200 dark:border-slate-700 text-xs">
          <p className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" /> Current Selected Area:
          </p>
          <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium">
            {location.address} ({location.city}, {location.state} - {location.pincode})
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
          </p>
        </div>

        {/* Distance Radius Filter Buttons */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Emergency Search Radius
          </label>
          <div className="flex items-center justify-between gap-1.5">
            {[1, 3, 5, 10, 20].map((r) => (
              <button
                key={r}
                onClick={() => setRadiusKm(r)}
                className={`flex-1 py-1.5 text-xs font-extrabold rounded-xl border transition-all ${
                  radiusKm === r
                    ? 'bg-blue-600 border-blue-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        {/* Manual City Switcher */}
        <div className="space-y-1.5 text-left pt-1">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Or Choose Major Metro Area
          </label>
          <div className="flex flex-wrap gap-1.5">
            {['Chennai', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad'].map((city) => (
              <button
                key={city}
                onClick={() => setManualCity(city)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                  location.city === city
                    ? 'bg-red-50 dark:bg-red-950 border-red-300 text-red-600 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={requestLocationPermission}
          disabled={isLoadingLocation}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-all"
        >
          <Navigation className="w-4 h-4" />
          <span>{isLoadingLocation ? 'Detecting GPS...' : 'Auto-Detect Live Location'}</span>
        </button>
      </div>
    </div>
  );
};
