import React, { useState } from 'react';
import { Hospital, Doctor, Pharmacy, Ambulance, BloodBank, DiagnosticLab } from '../types';
import { useLocation } from '../context/LocationContext';
import { useEmergency } from '../context/EmergencyContext';
import { HospitalCard } from '../components/HospitalCard';
import { DoctorCard } from '../components/DoctorCard';
import { PharmacyCard } from '../components/PharmacyCard';
import { AmbulanceTracker } from '../components/AmbulanceTracker';
import { EMERGENCY_HOTLINES } from '../data/mockData';
import {
  Hospital as HospitalIcon,
  Pill,
  Siren,
  Stethoscope,
  Droplet,
  TestTube,
  UserCheck,
  PhoneCall,
  Search,
  SlidersHorizontal,
  MapPin,
  CheckCircle2,
  Clock,
  Shield,
  Star,
  Activity,
  ChevronRight,
  Flame,
  Building,
  HeartHandshake,
  Heart
} from 'lucide-react';

interface HomeDashboardProps {
  hospitals: Hospital[];
  doctors: Doctor[];
  pharmacies: Pharmacy[];
  ambulances: Ambulance[];
  bloodBanks: BloodBank[];
  diagnosticLabs: DiagnosticLab[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onSelectHospital: (h: Hospital) => void;
  onBookAppointment: (h?: Hospital, d?: Doctor) => void;
  onRequestAmbulance: (h?: Hospital) => void;
  onOrderMedicines: (p: Pharmacy) => void;
  onOpenSos: () => void;
  onOpenChatbot?: () => void;
  onOpenSpecializedModal: (type: 'women' | 'child' | 'senior' | 'donors' | 'organ') => void;
  onOpenAccidentModal: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  hospitals,
  doctors,
  pharmacies,
  ambulances,
  bloodBanks,
  diagnosticLabs,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  onSelectHospital,
  onBookAppointment,
  onRequestAmbulance,
  onOrderMedicines,
  onOpenSos,
  onOpenChatbot,
  onOpenSpecializedModal,
  onOpenAccidentModal
}) => {
  const { location, radiusKm, setRadiusKm, openPermissionModal } = useLocation();
  const { triggerSOS } = useEmergency();

  // Filters State
  const [typeFilter, setTypeFilter] = useState<'All' | 'Government' | 'Private'>('All');
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [emergencyAvailableOnly, setEmergencyAvailableOnly] = useState(false);
  const [icuAvailableOnly, setIcuAvailableOnly] = useState(false);

  // Filter Hospitals by Distance Radius, Search, and Toggle Filters
  const filteredHospitals = hospitals.filter(h => {
    if (h.distanceKm > radiusKm) return false;
    if (typeFilter !== 'All' && h.type !== typeFilter) return false;
    if (openNowOnly && !h.isOpen) return false;
    if (emergencyAvailableOnly && !h.emergencyAvailable) return false;
    if (icuAvailableOnly && h.icuBedsAvailable <= 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.departments.some(d => d.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filteredDoctors = doctors.filter(d => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.hospitalName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredPharmacies = pharmacies.filter(p => {
    if (p.distanceKm > radiusKm) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
    }
    return true;
  });

  const QUICK_CARDS = [
    { title: '🏥 Nearby Hospitals', category: 'Hospitals', count: `${filteredHospitals.length} Ready`, color: 'bg-blue-600' },
    { title: '💊 Nearby Medical Shops', category: 'Pharmacies', count: `${filteredPharmacies.length} Open`, color: 'bg-emerald-600' },
    { title: '🚑 Nearby Ambulances', category: 'Ambulances', count: `${ambulances.length} Fleets`, color: 'bg-red-600' },
    { title: '👨‍⚕️ Nearby Clinics', category: 'Clinics', count: '5 Centers', color: 'bg-indigo-600' },
    { title: '🩸 Blood Banks', category: 'Blood Banks', count: `${bloodBanks.length} Stocked`, color: 'bg-rose-600' },
    { title: '🧪 Diagnostic Labs', category: 'Diagnostic Labs', count: `${diagnosticLabs.length} Active`, color: 'bg-purple-600' },
    { title: '👩‍⚕️ Doctors', category: 'Doctors', count: `${filteredDoctors.length} On Duty`, color: 'bg-teal-600' },
    { title: '☎ Emergency Contacts', category: 'Hotline', count: '24/7 Lines', color: 'bg-amber-600' }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-10 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-black text-amber-300 border border-white/20">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>24/7 Smart Emergency Healthcare Companion</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Welcome to MediLink – Your Smart Emergency Medical Assistance Platform
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Locate nearby hospitals, ICU beds, oxygen stock, ambulances, blood banks, and 24x7 pharmacies based on your live location in <strong className="text-white underline">{location.city}</strong>.
          </p>

          {/* Location & Emergency Shortcut Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-extrabold">
            <button
              onClick={openPermissionModal}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl backdrop-blur border border-white/20 flex items-center space-x-2 transition-all shadow"
            >
              <MapPin className="w-4 h-4 text-red-400 animate-bounce" />
              <span>Location: {location.address.substring(0, 30)}...</span>
              <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-black">{radiusKm}km Radius</span>
            </button>

            <button
              onClick={onOpenSos}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/40 flex items-center space-x-2 transition-all active:scale-95 animate-pulse"
            >
              <Siren className="w-4 h-4" />
              <span>🚨 EMERGENCY SOS</span>
            </button>

            <button
              onClick={onOpenAccidentModal}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow flex items-center space-x-1.5 transition-all"
            >
              <Flame className="w-4 h-4" />
              <span>Report Accident</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 3: Radius Filter Selector Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-extrabold">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-red-600" />
          <span className="text-slate-800 dark:text-slate-200">Emergency Services Search Distance:</span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {[1, 3, 5, 10, 20].map((r) => (
            <button
              key={r}
              onClick={() => setRadiusKm(r)}
              className={`px-3.5 py-1.5 rounded-xl border transition-all ${
                radiusKm === r
                  ? 'bg-blue-600 border-blue-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Within {r} km
            </button>
          ))}
        </div>
      </div>

      {/* QUICK ACCESS CARDS GRID - Clean Minimalism Nearby Services */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center">
          <Activity className="w-4 h-4 text-blue-600 mr-2" />
          Nearby Services
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveCategory('Hospitals')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
              activeCategory === 'Hospitals'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300'
            }`}
          >
            <span className="text-2xl mb-1">🏥</span>
            <span className="text-xs font-bold uppercase tracking-wide">Hospitals</span>
            <span className="text-[10px] opacity-75 mt-0.5">{filteredHospitals.length} Available</span>
          </button>

          <button
            onClick={() => setActiveCategory('Ambulances')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
              activeCategory === 'Ambulances'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300'
            }`}
          >
            <span className="text-2xl mb-1">🚑</span>
            <span className="text-xs font-bold uppercase tracking-wide">Ambulance</span>
            <span className="text-[10px] opacity-75 mt-0.5">{ambulances.length} Active</span>
          </button>

          <button
            onClick={() => setActiveCategory('Pharmacies')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
              activeCategory === 'Pharmacies'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-green-50 hover:bg-green-100 dark:bg-green-950/40 dark:hover:bg-green-900/60 text-green-700 dark:text-green-300'
            }`}
          >
            <span className="text-2xl mb-1">💊</span>
            <span className="text-xs font-bold uppercase tracking-wide">Pharma</span>
            <span className="text-[10px] opacity-75 mt-0.5">{filteredPharmacies.length} Open</span>
          </button>

          <button
            onClick={() => setActiveCategory('Blood Banks')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
              activeCategory === 'Blood Banks'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300'
            }`}
          >
            <span className="text-2xl mb-1">🩸</span>
            <span className="text-xs font-bold uppercase tracking-wide">Blood Bank</span>
            <span className="text-[10px] opacity-75 mt-0.5">{bloodBanks.length} Stocked</span>
          </button>
        </div>

        {/* Secondary Category Chips */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveCategory('Doctors')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              activeCategory === 'Doctors'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            👨‍⚕️ Specialist Doctors ({filteredDoctors.length})
          </button>
          <button
            onClick={() => setActiveCategory('Diagnostic Labs')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              activeCategory === 'Diagnostic Labs'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            🧪 Diagnostic Labs ({diagnosticLabs.length})
          </button>
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              activeCategory === 'All'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            🌐 View All Facilities
          </button>
        </div>
      </section>

      {/* Main Grid: 8 columns for facilities, 4 columns for Emergency SOS & AI Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Specialized Emergency Services Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-extrabold">
            <button
              onClick={() => onOpenSpecializedModal('women')}
              className="p-3 bg-pink-50 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-900 text-pink-700 dark:text-pink-300 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-pink-500" />
                <span>Women Care (1091)</span>
              </div>
            </button>

            <button
              onClick={() => onOpenSpecializedModal('child')}
              className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center space-x-2">
                <HeartHandshake className="w-4 h-4 text-blue-500" />
                <span>Child Support (1098)</span>
              </div>
            </button>

            <button
              onClick={() => onOpenSpecializedModal('senior')}
              className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-amber-500" />
                <span>Senior Assist (14567)</span>
              </div>
            </button>

            <button
              onClick={() => onOpenSpecializedModal('organ')}
              className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-emerald-500" />
                <span>Organ Donation</span>
              </div>
            </button>
          </div>

          {/* AMBULANCE DISPATCH TRACKER VIEW */}
          {activeCategory === 'Ambulances' && (
            <AmbulanceTracker
              ambulances={ambulances}
              onRequestDispatch={(amb) => onRequestAmbulance(amb ? { name: amb.hospitalAffiliation } as any : undefined)}
            />
          )}

          {/* HOSPITALS / PRIORITY MEDICAL FACILITIES VIEW */}
          {(activeCategory === 'Hospitals' || activeCategory === 'All') && (
            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-slate-900">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                  <HospitalIcon className="w-5 h-5 text-blue-600 mr-2" />
                  Priority Medical Facilities
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpenNowOnly(!openNowOnly)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                      openNowOnly
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    Open Now
                  </button>
                  <button
                    onClick={() => setEmergencyAvailableOnly(!emergencyAvailableOnly)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                      emergencyAvailableOnly
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    24x7 Emergency Care
                  </button>
                </div>
              </div>

              {/* Hospitals Cards Grid */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHospitals.map(hospital => (
                  <HospitalCard
                    key={hospital.id}
                    hospital={hospital}
                    onSelect={onSelectHospital}
                    onBookAppointment={(h) => onBookAppointment(h)}
                    onRequestAmbulance={(h) => onRequestAmbulance(h)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* DOCTORS VIEW */}
          {activeCategory === 'Doctors' && (
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold">
                <span className="flex items-center text-slate-900 dark:text-white">
                  <Stethoscope className="w-4 h-4 text-teal-600 mr-2" /> Nearby Specialist Doctors On Duty Today ({filteredDoctors.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.map(doctor => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onBookAppointment={(d) => onBookAppointment(undefined, d)}
                    onVideoConsult={(d) => alert(`Starting encrypted tele-health video room with ${d.name}...`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* PHARMACIES VIEW */}
          {activeCategory === 'Pharmacies' && (
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold">
                <span className="flex items-center text-slate-900 dark:text-white">
                  <Pill className="w-4 h-4 text-emerald-600 mr-2" /> Nearby 24x7 Medical Shops & Pharmacies ({filteredPharmacies.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPharmacies.map(pharmacy => (
                  <PharmacyCard
                    key={pharmacy.id}
                    pharmacy={pharmacy}
                    onOrderMedicines={onOrderMedicines}
                  />
                ))}
              </div>
            </div>
          )}

          {/* BLOOD BANKS VIEW */}
          {activeCategory === 'Blood Banks' && (
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold">
                <span className="flex items-center text-slate-900 dark:text-white">
                  <Droplet className="w-4 h-4 text-red-600 mr-2" /> Blood Banks Stock Availability ({bloodBanks.length})
                </span>
                <button
                  onClick={() => onOpenSpecializedModal('donors')}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-xl shadow"
                >
                  Find Blood Donors
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bloodBanks.map(bb => (
                  <div key={bb.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-black text-sm text-slate-900 dark:text-white">{bb.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{bb.address}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-extrabold text-[10px] rounded-xl">
                        {bb.distanceKm} km
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Live Blood Units Stock
                      </p>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs font-extrabold">
                        {Object.entries(bb.bloodGroupStock).map(([group, count]) => (
                          <div key={group} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <span className="block text-red-600 font-black">{group}</span>
                            <span className="text-slate-800 dark:text-slate-200">{count} Units</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <a
                      href={`tel:${bb.contactNumber}`}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1 shadow"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Blood Bank ({bb.contactNumber})</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: SOS Emergency Trigger & MediAI Assistant */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Emergency SOS Card */}
          <div className="bg-red-600 rounded-2xl p-6 text-white flex flex-col items-center justify-center text-center shadow-lg shadow-red-200 dark:shadow-none">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-400/30">
              <Siren className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h3 className="text-2xl font-black mb-1 tracking-tight">EMERGENCY SOS</h3>
            <p className="text-red-100 text-xs mb-6 px-4 leading-relaxed">
              Tap to trigger immediate ambulance dispatch and broadcast GPS coordinates to emergency services
            </p>
            <button
              onClick={onOpenSos}
              className="w-full bg-white text-red-600 font-extrabold py-3.5 rounded-xl shadow-inner active:scale-95 transition-transform uppercase tracking-wider text-xs hover:bg-red-50"
            >
              Trigger SOS Now
            </button>
          </div>

          {/* MediAI Assistant Live Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
            <div className="bg-slate-900 p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">MediAI Assistant</p>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">Online - Always here to help</p>
              </div>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl border border-slate-100 dark:border-slate-700/60">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  I am tracking your location in <strong className="text-slate-900 dark:text-white">{location.city}</strong>. I see 4 Advanced Life Support ambulances within 5 minutes of you.
                </p>
              </div>
              <div className="bg-blue-600 p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl text-white ml-6">
                <p className="leading-relaxed font-medium">Find nearest ICU bed with oxygen facility.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl border border-slate-100 dark:border-slate-700/60">
                <p className="text-slate-700 dark:text-slate-300 font-semibold">Scanning nearby hospitals...</p>
                <p className="text-slate-600 dark:text-slate-400 mt-1 italic">
                  {filteredHospitals[0]?.name || 'Apollo Medical Center'} ({filteredHospitals[0]?.distanceKm || 0.8}km) has {filteredHospitals[0]?.icuBedsAvailable || 3} ICU beds available now.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onOpenChatbot}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-colors shadow flex items-center justify-center space-x-1.5"
              >
                <span>Ask MediAI Health Assistant</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EMERGENCY HOTLINES DIRECTORY */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center space-x-2">
          <PhoneCall className="w-5 h-5 text-red-500 animate-pulse" />
          <h3 className="font-black text-sm uppercase tracking-wider">
            24x7 National Offline Emergency Hotline Directory
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EMERGENCY_HOTLINES.map((hotline, idx) => (
            <a
              key={idx}
              href={`tel:${hotline.number}`}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-2xl flex flex-col justify-between space-y-2 transition-all group"
            >
              <span className="text-xs font-bold text-slate-300">{hotline.title}</span>
              <span className="text-lg font-black text-white group-hover:text-red-400 transition-colors">
                Dial {hotline.number}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
