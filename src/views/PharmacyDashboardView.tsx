import React, { useState } from 'react';
import { Pharmacy } from '../types';
import { Pill, ShoppingBag, Clock, CheckCircle2, Phone, Check } from 'lucide-react';

interface PharmacyDashboardViewProps {
  pharmacy: Pharmacy;
}

export const PharmacyDashboardView: React.FC<PharmacyDashboardViewProps> = ({ pharmacy }) => {
  const [deliveryActive, setDeliveryActive] = useState(pharmacy.homeDelivery);
  const [open24x7, setOpen24x7] = useState(pharmacy.is24x7);

  return (
    <div className="space-y-8 pb-16">
      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-extrabold text-[10px] rounded uppercase">
            MEDICAL SHOP & PHARMACY PORTAL
          </span>
          <h2 className="text-xl font-black mt-1">{pharmacy.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{pharmacy.address} • License #PHARM-TN-9901</p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-extrabold">
          <button
            onClick={() => setDeliveryActive(!deliveryActive)}
            className={`px-4 py-2.5 rounded-xl border transition-colors ${
              deliveryActive ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            {deliveryActive ? '✓ Home Delivery Active' : 'Delivery Off'}
          </button>
        </div>
      </div>

      {/* Orders Queue */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center">
          <ShoppingBag className="w-5 h-5 text-emerald-600 mr-2" /> Incoming Medicine Orders
        </h3>

        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <div>
            <strong className="text-slate-900 dark:text-white">Order #ORD-8821 (Emergency Antibiotics & Insulin)</strong>
            <p className="text-slate-500 text-[11px]">Customer: Sarah Morgan • Delivery Address: Nungambakkam</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow">
            Dispatch Rider
          </button>
        </div>
      </div>
    </div>
  );
};
