import React from 'react';
import { Hospital, Ambulance, Pharmacy, BloodBank } from '../types';
import { Navigation, MapPin, Phone, Hospital as HospitalIcon, Pill, Siren } from 'lucide-react';

interface MapContainerProps {
  userLocation: { latitude: number; longitude: number; address: string };
  hospitals?: Hospital[];
  ambulances?: Ambulance[];
  pharmacies?: Pharmacy[];
  bloodBanks?: BloodBank[];
  selectedItem?: Hospital | Ambulance | Pharmacy | BloodBank | null;
  onSelectItem?: (item: any) => void;
  height?: string;
  zoomLevel?: number;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  userLocation,
  hospitals = [],
  ambulances = [],
  pharmacies = [],
  bloodBanks = [],
  selectedItem,
  onSelectItem,
  height = 'h-80'
}) => {
  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-inner flex flex-col`}>
      {/* Visual Simulated Map Grid */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Top Map Status Bar */}
      <div className="relative z-10 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Live GPS Map • {userLocation.address}
          </span>
        </div>
        <div className="flex items-center space-x-3 font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center"><HospitalIcon className="w-3.5 h-3.5 text-blue-600 mr-1" /> {hospitals.length} Hospitals</span>
          <span className="flex items-center"><Pill className="w-3.5 h-3.5 text-emerald-600 mr-1" /> {pharmacies.length} Medical Shops</span>
          <span className="flex items-center"><Siren className="w-3.5 h-3.5 text-red-600 mr-1" /> {ambulances.length} Ambulances</span>
        </div>
      </div>

      {/* Interactive Canvas Grid Map View */}
      <div className="relative flex-1 w-full flex items-center justify-center p-6 overflow-hidden">
        {/* User Location Radar Pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full border border-blue-500/20 animate-ping" />
          <div className="w-32 h-32 rounded-full border border-blue-500/30" />
        </div>

        {/* User Location Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer">
          <div className="bg-blue-600 text-white p-2.5 rounded-full shadow-lg shadow-blue-500/50 ring-4 ring-blue-500/30 animate-bounce">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="mt-1 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            YOUR LIVE LOCATION
          </span>
        </div>

        {/* Scattered Hospital Pins */}
        {hospitals.map((h, i) => {
          const offsetX = (i % 2 === 0 ? 1 : -1) * (60 + i * 45);
          const offsetY = (i % 3 === 0 ? -1 : 1) * (40 + i * 30);
          const isSelected = selectedItem?.id === h.id;

          return (
            <div
              key={h.id}
              onClick={() => onSelectItem && onSelectItem(h)}
              style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
              className={`absolute z-10 flex flex-col items-center cursor-pointer transition-all duration-300 ${isSelected ? 'scale-125 z-30' : 'hover:scale-110'}`}
            >
              <div className={`p-2 rounded-xl shadow-lg border text-white flex items-center justify-center ${
                h.type === 'Government' ? 'bg-indigo-600 border-indigo-400' : 'bg-blue-600 border-blue-400'
              }`}>
                <HospitalIcon className="w-4 h-4" />
              </div>
              <div className="mt-1 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-[10px] font-bold px-2 py-0.5 rounded-md shadow whitespace-nowrap flex items-center space-x-1">
                <span>{h.name.substring(0, 18)}...</span>
                <span className="text-blue-600 font-extrabold">({h.distanceKm}km)</span>
              </div>
            </div>
          );
        })}

        {/* Scattered Ambulance Pins */}
        {ambulances.map((amb, i) => {
          const offsetX = (i % 2 === 0 ? -1 : 1) * (90 + i * 35);
          const offsetY = (i % 2 === 0 ? 1 : -1) * (70 + i * 25);
          const isSelected = selectedItem?.id === amb.id;

          return (
            <div
              key={amb.id}
              onClick={() => onSelectItem && onSelectItem(amb)}
              style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
              className={`absolute z-10 flex flex-col items-center cursor-pointer transition-all duration-300 ${isSelected ? 'scale-125 z-30' : 'hover:scale-110'}`}
            >
              <div className="bg-red-600 text-white p-2 rounded-xl shadow-lg shadow-red-500/40 ring-2 ring-red-400 animate-pulse">
                <Siren className="w-4 h-4" />
              </div>
              <div className="mt-1 bg-red-950/90 border border-red-800 text-red-200 text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                {amb.vehicleNumber} ({amb.etaMinutes}m ETA)
              </div>
            </div>
          );
        })}

        {/* Scattered Pharmacy Pins */}
        {pharmacies.map((p, i) => {
          const offsetX = (i % 2 === 0 ? 1 : -1) * (130 - i * 20);
          const offsetY = (i % 2 === 0 ? -1 : 1) * (80 + i * 15);

          return (
            <div
              key={p.id}
              onClick={() => onSelectItem && onSelectItem(p)}
              style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
              className="absolute z-10 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
            >
              <div className="bg-emerald-600 text-white p-1.5 rounded-lg shadow border border-emerald-400">
                <Pill className="w-3.5 h-3.5" />
              </div>
              <div className="mt-1 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 text-[9px] font-semibold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                {p.name.substring(0, 15)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Item Floating Info Popup Banner */}
      {selectedItem && (
        <div className="absolute bottom-3 left-3 right-3 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-blue-500/30 shadow-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              {'icuBedsAvailable' in selectedItem ? <HospitalIcon className="w-5 h-5" /> : <Siren className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>{selectedItem.name || selectedItem.vehicleNumber}</span>
                {'type' in selectedItem && (
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold px-1.5 py-0.5 rounded">
                    {selectedItem.type}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center mt-0.5">
                <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                {selectedItem.address || `${selectedItem.distanceKm} km away from your location`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {'contactNumber' in selectedItem && (
              <a
                href={`tel:${selectedItem.contactNumber}`}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center shadow-md transition-colors"
              >
                <Phone className="w-3.5 h-3.5 mr-1" /> Call
              </a>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedItem.lat || userLocation.latitude},${selectedItem.lng || userLocation.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center shadow-md transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 mr-1" /> Directions
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
