import React, { useState } from 'react';
import { INITIAL_BLOOD_DONORS } from '../data/mockData';
import { Shield, HeartHandshake, UserCheck, Heart, PhoneCall, Droplet, Sparkles, X, CheckCircle2 } from 'lucide-react';

interface SpecializedSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: 'women' | 'child' | 'senior' | 'donors' | 'organ';
}

export const SpecializedSupportModal: React.FC<SpecializedSupportModalProps> = ({
  isOpen,
  onClose,
  activeTab = 'women'
}) => {
  const [tab, setTab] = useState<'women' | 'child' | 'senior' | 'donors' | 'organ'>(activeTab);
  const [donorSearchGroup, setDonorSearchGroup] = useState('O-');
  const [registeredDonor, setRegisteredDonor] = useState(false);

  if (!isOpen) return null;

  const filteredDonors = INITIAL_BLOOD_DONORS.filter(
    d => d.bloodGroup === donorSearchGroup || donorSearchGroup === 'ALL'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="font-extrabold text-base">Specialized Emergency Assistance</h3>
              <p className="text-xs text-slate-400">Dedicated Helplines & Community Support Services</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 overflow-x-auto text-xs font-extrabold">
          <button
            onClick={() => setTab('women')}
            className={`py-3 px-3 border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
              tab === 'women' ? 'border-pink-500 text-pink-600' : 'border-transparent text-slate-500'
            }`}
          >
            <Shield className="w-4 h-4 text-pink-500" />
            <span>Women Support (1091)</span>
          </button>

          <button
            onClick={() => setTab('child')}
            className={`py-3 px-3 border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
              tab === 'child' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-blue-500" />
            <span>Child Support (1098)</span>
          </button>

          <button
            onClick={() => setTab('senior')}
            className={`py-3 px-3 border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
              tab === 'senior' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500'
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-500" />
            <span>Senior Citizen (14567)</span>
          </button>

          <button
            onClick={() => setTab('donors')}
            className={`py-3 px-3 border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
              tab === 'donors' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-500'
            }`}
          >
            <Droplet className="w-4 h-4 text-red-500" />
            <span>Blood Donors</span>
          </button>

          <button
            onClick={() => setTab('organ')}
            className={`py-3 px-3 border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
              tab === 'organ' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500'
            }`}
          >
            <Heart className="w-4 h-4 text-emerald-500" />
            <span>Organ Donation</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-800 dark:text-slate-200">
          {/* WOMEN'S EMERGENCY */}
          {tab === 'women' && (
            <div className="space-y-4">
              <div className="p-4 bg-pink-50 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-900 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-pink-900 dark:text-pink-200">
                    24x7 Women's Safety & Emergency Distress Helpline
                  </h4>
                  <p className="text-pink-700 dark:text-pink-300 mt-1">
                    Direct connection to Women's Safety Cell, PCR Response, and Ambulance Dispatch.
                  </p>
                </div>
                <a
                  href="tel:1091"
                  className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-black rounded-xl shadow flex items-center space-x-1 shrink-0"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Dial 1091</span>
                </a>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-white">Includes Emergency Features:</h5>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  <li>Automated Live GPS location sharing with nearest Women Protection Officer.</li>
                  <li>Obstetric & Maternity emergency ambulance dispatch.</li>
                  <li>Confidential tele-counseling and immediate rescue response.</li>
                </ul>
              </div>
            </div>
          )}

          {/* CHILD SUPPORT */}
          {tab === 'child' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-blue-900 dark:text-blue-200">
                    Childline National Emergency Care (1098)
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 mt-1">
                    24x7 free emergency phone service for children in need of medical or emergency protection.
                  </p>
                </div>
                <a
                  href="tel:1098"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow flex items-center space-x-1 shrink-0"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Dial 1098</span>
                </a>
              </div>
            </div>
          )}

          {/* SENIOR CITIZEN */}
          {tab === 'senior' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-amber-900 dark:text-amber-200">
                    Elder Line Senior Citizen Assistance (14567)
                  </h4>
                  <p className="text-amber-700 dark:text-amber-300 mt-1">
                    Free national helpline for senior citizens needing emergency medical care, home pickup, or assistance.
                  </p>
                </div>
                <a
                  href="tel:14567"
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl shadow flex items-center space-x-1 shrink-0"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Dial 14567</span>
                </a>
              </div>
            </div>
          )}

          {/* BLOOD DONORS REGISTRY */}
          {tab === 'donors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Emergency Voluntary Blood Donors Network
                  </h4>
                  <p className="text-slate-500">Find active donors matching rare blood groups in your city</p>
                </div>

                <select
                  value={donorSearchGroup}
                  onChange={e => setDonorSearchGroup(e.target.value)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="ALL">All Blood Groups</option>
                  <option value="O-">O- (Universal Donor)</option>
                  <option value="AB-">AB- (Rare Group)</option>
                  <option value="B+">B+</option>
                  <option value="A+">A+</option>
                </select>
              </div>

              <div className="space-y-2">
                {filteredDonors.map(donor => (
                  <div key={donor.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 bg-red-600 text-white font-black rounded text-[10px] mr-2">
                        {donor.bloodGroup}
                      </span>
                      <strong className="text-slate-900 dark:text-white">{donor.name}</strong> ({donor.city})
                      <p className="text-[10px] text-slate-400 mt-0.5">Last Donated: {donor.lastDonatedDate}</p>
                    </div>

                    <a
                      href={`tel:${donor.mobile}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center shadow"
                    >
                      <PhoneCall className="w-3.5 h-3.5 mr-1" /> Call Donor
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORGAN DONATION */}
          {tab === 'organ' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-2xl">
                <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200">
                  National Organ & Tissue Transplant Organization (NOTTO) Info
                </h4>
                <p className="text-emerald-700 dark:text-emerald-300 mt-1">
                  Pledge to save lives through organ donation. Register your donor card digitally.
                </p>

                {!registeredDonor ? (
                  <button
                    onClick={() => setRegisteredDonor(true)}
                    className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow"
                  >
                    Pledge Organ Donation Digitally
                  </button>
                ) : (
                  <div className="mt-3 p-3 bg-white dark:bg-slate-900 border border-emerald-300 rounded-xl flex items-center space-x-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Digital Organ Donor Pledge Registered to Profile!</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
