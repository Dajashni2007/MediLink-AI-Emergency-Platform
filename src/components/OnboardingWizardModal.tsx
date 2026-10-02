import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import {
  Siren, Shield, Mail, Lock, User, Phone, Calendar, Heart, ArrowRight,
  CheckCircle2, X, KeyRound, MapPin, Compass, Camera, FileText, Check
} from 'lucide-react';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAbout?: () => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onNavigateToAbout
}) => {
  const {
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    continueAsGuest,
    updateProfile
  } = useAuth();

  const { location, requestLocationPermission, isLocating } = useLocation();

  // Wizard Step: 2 = Welcome, 3 = Create Account, 4 = OTP, 5 = Location, 6 = Complete Profile
  const [currentStep, setCurrentStep] = useState<2 | 3 | 4 | 5 | 6>(2);

  // Form State for Step 3
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    emergencyContactName: '',
    emergencyContactNumber: ''
  });

  // OTP State
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  // Profile Customization for Step 6
  const [medicalConditions, setMedicalConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [preferredHospital, setPreferredHospital] = useState('Apollo Medical Center');
  const [preferredLanguage, setPreferredLanguage] = useState('English');

  // Login form state
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Handlers
  const handleNextToOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrorMsg('Full Name is required');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      setErrorMsg('Valid 10-digit mobile number is required');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Valid email address is required');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (!formData.emergencyContactName.trim() || !formData.emergencyContactNumber.trim()) {
      setErrorMsg('Family emergency contact name and number are required');
      return;
    }

    setErrorMsg('');
    setCurrentStep(4); // Move to OTP
  };

  const handleVerifyOtp = () => {
    if (otpInput.length < 4) {
      setErrorMsg('Please enter the 4-digit verification code sent to your phone (e.g. 1234)');
      return;
    }
    setErrorMsg('');
    setOtpVerified(true);
    setTimeout(() => {
      setCurrentStep(5); // Move to Location Permission
    }, 1200);
  };

  const handleLocationNext = () => {
    setCurrentStep(6); // Move to Complete Profile
  };

  const handleSaveFinalProfile = async () => {
    await signupWithEmail({
      name: formData.fullName || 'Alex Morgan',
      email: formData.email || 'alex@medilink.org',
      mobile: formData.mobile || '+91 98765 43210',
      dob: formData.dob || '1995-08-15',
      gender: formData.gender as any,
      bloodGroup: formData.bloodGroup,
      emergencyContactName: formData.emergencyContactName || 'Family Member',
      emergencyContactNumber: formData.emergencyContactNumber || '+91 98765 00000',
    });

    updateProfile({
      address: `${location.address}, ${location.city}, ${location.state}`,
    });

    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setErrorMsg('Email address is required');
      return;
    }
    await loginWithEmail(loginEmail, loginPass);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">

        {/* Modal Header Progress Bar */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg">
              <Siren className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">MediLink Onboarding</h2>
              <p className="text-[11px] text-slate-400 font-medium">Step {currentStep} of 6 • Commercial Patient Setup</p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            <div className={`h-1.5 rounded-full ${currentStep >= 2 ? 'bg-red-600' : 'bg-slate-800'}`} />
            <div className={`h-1.5 rounded-full ${currentStep >= 3 ? 'bg-red-600' : 'bg-slate-800'}`} />
            <div className={`h-1.5 rounded-full ${currentStep >= 4 ? 'bg-red-600' : 'bg-slate-800'}`} />
            <div className={`h-1.5 rounded-full ${currentStep >= 5 ? 'bg-red-600' : 'bg-slate-800'}`} />
            <div className={`h-1.5 rounded-full ${currentStep >= 6 ? 'bg-red-600' : 'bg-slate-800'}`} />
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl text-xs font-bold flex items-center justify-between">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg('')} className="text-red-500 font-black">✕</button>
            </div>
          )}

          {/* STEP 2: WELCOME PAGE */}
          {currentStep === 2 && !isLoginMode && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-black text-[10px] rounded-full uppercase tracking-wider">
                  Step 2 • Authentication Portal
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Welcome to MediLink
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your Smart Emergency Healthcare Companion. Instant access to nearby hospitals, 24x7 ambulance dispatch, live blood bank units, and doctor consultations.
                </p>
              </div>

              <div className="space-y-3 max-w-sm mx-auto pt-2">
                <button
                  onClick={() => { loginWithGoogle(); onClose(); }}
                  className="w-full py-3 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.15C3.21 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.21C.44 8.1 0 9.99 0 12s.44 3.9 1.21 5.44l4.11-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.21 2.64 1.21 6.56l4.11 3.15c.94-2.82 3.58-4.96 6.68-4.96z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  onClick={() => setIsLoginMode(true)}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 shadow transition-all"
                >
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Continue with Email Sign In</span>
                </button>

                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-red-500/20 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Create Account (Sign Up)</span>
                </button>

                <button
                  onClick={() => { continueAsGuest(); onClose(); }}
                  className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline transition-colors"
                >
                  Continue as Guest
                </button>
              </div>

              {/* Informational Footer Links */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-4 text-[11px] font-bold text-slate-500">
                <button onClick={() => { onClose(); onNavigateToAbout?.(); }} className="hover:text-blue-600">
                  About MediLink
                </button>
                <span>•</span>
                <button onClick={() => { onClose(); onNavigateToAbout?.(); }} className="hover:text-blue-600">
                  Privacy Policy
                </button>
                <span>•</span>
                <button onClick={() => { onClose(); onNavigateToAbout?.(); }} className="hover:text-blue-600">
                  Terms & Conditions
                </button>
                <span>•</span>
                <button onClick={() => { onClose(); onNavigateToAbout?.(); }} className="hover:text-blue-600">
                  Contact Us
                </button>
              </div>
            </div>
          )}

          {/* LOGIN FORM IF SELECTED IN STEP 2 */}
          {currentStep === 2 && isLoginMode && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Sign In to Your Account</h3>
                <button
                  type="button"
                  onClick={() => setIsLoginMode(false)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  ← Back
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                    placeholder="alex@example.com"
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Password *</label>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
              >
                Login & Access Network
              </button>
            </form>
          )}

          {/* STEP 3: CREATE ACCOUNT FORM */}
          {currentStep === 3 && (
            <form onSubmit={handleNextToOTP} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-black text-[10px] rounded-full uppercase tracking-wider">
                    Step 3 • Personal Details
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                    Create Medical Profile
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    placeholder="Alex Morgan"
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="alex@example.com"
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Emergency Contact Box */}
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl space-y-2">
                <p className="font-extrabold text-red-700 dark:text-red-300 text-xs flex items-center">
                  <Shield className="w-3.5 h-3.5 mr-1 text-red-500" /> Family Emergency Contact *
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    required
                    placeholder="Contact Person Name"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <input
                    type="tel"
                    value={formData.emergencyContactNumber}
                    onChange={e => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                    required
                    placeholder="Emergency Contact Phone"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center space-x-1"
                >
                  <span>Next: Send OTP Verification</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: OTP VERIFICATION */}
          {currentStep === 4 && (
            <div className="text-center space-y-5 py-4">
              <span className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-black text-[10px] rounded-full uppercase tracking-wider">
                Step 4 • Phone Verification
              </span>

              <div className="w-16 h-16 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow">
                <KeyRound className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">OTP Sent Successfully</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  We have sent a 4-digit security code to <strong className="text-slate-800 dark:text-slate-200">{formData.mobile || '+91 98765 43210'}</strong>
                </p>
              </div>

              {otpVerified ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl max-w-xs mx-auto text-xs font-bold space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto animate-bounce" />
                  <p className="text-sm font-black">Account Created Successfully!</p>
                  <p className="text-[10px] opacity-80">Proceeding to location permission...</p>
                </div>
              ) : (
                <div className="space-y-4 max-w-xs mx-auto">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value)}
                    placeholder="1 2 3 4"
                    className="w-40 text-center text-3xl font-black tracking-widest p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl mx-auto block"
                  />

                  <button
                    onClick={handleVerifyOtp}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
                  >
                    Verify & Continue →
                  </button>

                  <button
                    onClick={() => alert('New OTP code sent to your phone: 1234')}
                    className="text-[11px] font-bold text-blue-600 hover:underline block mx-auto"
                  >
                    Resend Code (SMS)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: ALLOW LOCATION PERMISSION */}
          {currentStep === 5 && (
            <div className="text-center space-y-5 py-4">
              <span className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-black text-[10px] rounded-full uppercase tracking-wider">
                Step 5 • GPS Location Setup
              </span>

              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/60 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow">
                <MapPin className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Allow Location Access</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  MediLink requires precise GPS coordinates to calculate real-time hospital distances and dispatch emergency ambulances instantly.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>Detected Location Details:</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded">GPS Active</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  📍 <strong>Address:</strong> {location.address}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  🏙️ <strong>City / State:</strong> {location.city}, {location.district}, {location.state} ({location.pincode})
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Coordinates: Lat {location.latitude.toFixed(4)}, Lng {location.longitude.toFixed(4)}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={async () => {
                    await requestLocationPermission();
                  }}
                  disabled={isLocating}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center space-x-1.5"
                >
                  <Compass className="w-4 h-4" />
                  <span>{isLocating ? 'Detecting GPS...' : 'Refresh GPS Coordinates'}</span>
                </button>

                <button
                  onClick={handleLocationNext}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: COMPLETE PROFILE */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div>
                <span className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-black text-[10px] rounded-full uppercase tracking-wider">
                  Step 6 • Optional Preferences
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                  Complete Patient Medical File
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {/* Photo Upload Simulation */}
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Profile Avatar / Photo</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-600 text-white font-black text-xl rounded-2xl flex items-center justify-center shadow">
                      {formData.fullName ? formData.fullName[0].toUpperCase() : 'A'}
                    </div>
                    <button
                      type="button"
                      onClick={() => alert('Photo uploaded successfully!')}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 rounded-xl flex items-center space-x-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Pre-existing Medical Conditions (Optional)</label>
                  <input
                    type="text"
                    value={medicalConditions}
                    onChange={e => setMedicalConditions(e.target.value)}
                    placeholder="e.g. Asthma, Type 2 Diabetes, Hypertension"
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Known Drug or Food Allergies (Optional)</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={e => setAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Peanuts, Sulfa drugs"
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Preferred Primary Hospital</label>
                    <select
                      value={preferredHospital}
                      onChange={e => setPreferredHospital(e.target.value)}
                      className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    >
                      <option value="Apollo Medical Center">Apollo Medical Center</option>
                      <option value="Fortis Healthcare">Fortis Healthcare</option>
                      <option value="Manipal Hospital">Manipal Hospital</option>
                      <option value="Government General Hospital">Government General Hospital</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Preferred App Language</label>
                    <select
                      value={preferredLanguage}
                      onChange={e => setPreferredLanguage(e.target.value)}
                      className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="Spanish">Spanish (Español)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveFinalProfile}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile & Enter Home Dashboard</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
