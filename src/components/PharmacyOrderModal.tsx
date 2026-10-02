import React, { useState } from 'react';
import { Pharmacy, MedicineOrder } from '../types';
import { X, Pill, ShoppingBag, Plus, Minus, CheckCircle2, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PharmacyOrderModalProps {
  pharmacy: Pharmacy | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced?: (order: MedicineOrder) => void;
}

interface MedicineItem {
  id: string;
  name: string;
  category: string;
  price: number;
  qty: number;
  prescriptionRequired: boolean;
}

const DEFAULT_MEDICINES: MedicineItem[] = [
  { id: 'm1', name: 'Paracetamol 650mg (10 Tabs)', category: 'Fever & Pain Relief', price: 35, qty: 1, prescriptionRequired: false },
  { id: 'm2', name: 'Amoxicillin Antibiotic 500mg', category: 'Antibiotic', price: 120, qty: 0, prescriptionRequired: true },
  { id: 'm3', name: 'Emergency First Aid Kit Box', category: 'Emergency Supply', price: 450, qty: 1, prescriptionRequired: false },
  { id: 'm4', name: 'Pain Relief Gel / Spray (100g)', category: 'Topical Pain Relief', price: 180, qty: 0, prescriptionRequired: false },
  { id: 'm5', name: 'Digital Blood Pressure Monitor', category: 'Medical Device', price: 1450, qty: 0, prescriptionRequired: false },
  { id: 'm6', name: 'Digital Clinical Thermometer', category: 'Diagnostic Device', price: 250, qty: 0, prescriptionRequired: false },
];

export const PharmacyOrderModal: React.FC<PharmacyOrderModalProps> = ({
  pharmacy,
  isOpen,
  onClose,
  onOrderPlaced
}) => {
  const { user } = useAuth();
  const [items, setItems] = useState<MedicineItem[]>(DEFAULT_MEDICINES);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || 'HSR Layout, Sector 2, Bangalore');
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

  if (!isOpen || !pharmacy) return null;

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const selectedItems = items.filter(i => i.qty > 0);
  const totalAmount = selectedItems.reduce((acc, i) => acc + i.price * i.qty, 0) + 30; // 30 delivery fee

  const handleConfirmOrder = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one medicine to order');
      return;
    }

    const order: MedicineOrder = {
      id: `ord_${Date.now()}`,
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
      items: selectedItems.map(i => `${i.name} (x${i.qty})`),
      patientName: user?.name || 'Alex Morgan',
      patientMobile: user?.mobile || '+91 98765 43210',
      deliveryAddress,
      totalAmount,
      status: 'Received',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setIsOrderConfirmed(true);
    if (onOrderPlaced) {
      onOrderPlaced(order);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-emerald-600 text-white p-5 relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">{pharmacy.name}</h3>
              <p className="text-xs text-emerald-100">{pharmacy.address} • {pharmacy.distanceKm} km away</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200 space-y-5">
          {isOrderConfirmed ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">Order Confirmed!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  {pharmacy.name} has accepted your order. An express delivery driver is dispatched.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">Order Summary:</p>
                {selectedItems.map(item => (
                  <p key={item.id} className="text-slate-600 dark:text-slate-300">
                    • {item.name} x {item.qty} — ₹{item.price * item.qty}
                  </p>
                ))}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-extrabold text-slate-900 dark:text-white">
                  <span>Total Amount Paid:</span>
                  <span className="text-emerald-600">₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => { setIsOrderConfirmed(false); onClose(); }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow"
              >
                Done & Close
              </button>
            </div>
          ) : (
            <>
              {/* Medicine List */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-1 text-emerald-600" />
                  Select Available Medicines
                </h4>

                <div className="space-y-2">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-[10px] text-slate-500">₹{item.price} • {item.category}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold flex items-center justify-center hover:bg-slate-300"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-extrabold w-4 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center hover:bg-emerald-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="space-y-2 text-xs">
                <label className="block font-bold text-slate-600 dark:text-slate-400">Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2 text-xs">
                <label className="block font-bold text-slate-600 dark:text-slate-400">Payment Option</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      paymentMethod === 'cod'
                        ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Cash on Delivery
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      paymentMethod === 'upi'
                        ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    UPI Instant
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      paymentMethod === 'card'
                        ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                </div>
              </div>

              {/* Bill Summary */}
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal:</span>
                  <span>₹{totalAmount - 30}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Express Delivery Fee:</span>
                  <span>₹30</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Total Payable:</span>
                  <span className="text-emerald-600">₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all"
              >
                Place Express Medicine Order (₹{totalAmount})
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
