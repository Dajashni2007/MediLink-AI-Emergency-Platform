import React from 'react';
import { Pharmacy } from '../types';
import { Pill, Phone, Navigation, ShoppingBag, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onOrderMedicines: (p: Pharmacy) => void;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({ pharmacy, onOrderMedicines }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between space-y-4">
      {/* Top Banner & Header */}
      <div className="flex items-start space-x-3.5">
        <img
          src={pharmacy.photo}
          alt={pharmacy.name}
          className="w-16 h-16 rounded-2xl object-cover shadow border border-slate-200 dark:border-slate-700 shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
              {pharmacy.name}
            </h3>
            {pharmacy.is24x7 && (
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-md font-extrabold text-[10px] whitespace-nowrap">
                24x7 Open
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {pharmacy.address}
          </p>

          <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {pharmacy.distanceKm} km away
            </span>
            <span>• ★ {pharmacy.rating}</span>
          </div>
        </div>
      </div>

      {/* Stock Categories */}
      {pharmacy.stockCategories && (
        <div className="flex flex-wrap gap-1 text-[10px] font-semibold">
          {pharmacy.stockCategories.map((cat, i) => (
            <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Delivery Tag */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />
          {pharmacy.homeDelivery ? 'Home Delivery Available' : 'Store Pickup Only'}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">
          Payments: {pharmacy.acceptedPayments.join(', ')}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 text-xs font-extrabold">
        <a
          href={`tel:${pharmacy.contactNumber}`}
          className="py-2.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl flex items-center justify-center space-x-1 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-500" />
          <span>Call</span>
        </a>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl flex items-center justify-center space-x-1 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-500" />
          <span>Map</span>
        </a>

        <button
          onClick={() => onOrderMedicines(pharmacy)}
          className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow flex items-center justify-center space-x-1 transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Order</span>
        </button>
      </div>
    </div>
  );
};
