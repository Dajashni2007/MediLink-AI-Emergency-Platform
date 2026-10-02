import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Siren, Shield, Mail, Lock, User, Phone, Calendar, Heart, ArrowRight, CheckCircle, X, KeyRound } from 'lucide-react';

interface WelcomeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: 'welcome' | 'login' | 'signup' | 'otp';
}

export const WelcomeAuthModal: React.FC<WelcomeAuthModalProps> = ({
  isOpen,
  onClose,
  initialStep = 'welcome'
}) => {
  const {
    authModalStep,
    openAuthModal,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    continueAsGuest
  } = useAuth();

  const [step, setStep] = useState<'welcome' | 'login' | 'signup' | 'otp'>(initialStep);

  // Registration Form State
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

  const [otpInput, setOtpInput] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.mobile) {
      setErrorMsg('Please fill in required fields (Name, Email, Mobile)');
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setErrorMsg('');
    setStep('otp');
  };

  const handleVerifyOtp = async () => {
    if (otpInput.length < 4) {
      setErrorMsg('Please enter 4-digit OTP sent to your phone (e.g. 1234)');
      return;
    }
    await signupWithEmail({
      name: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      dob: formData.dob,
      gender: formData.gender as any,
      bloodGroup: formData.bloodGroup,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactNumber: formData.emergencyContactNumber
    });
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setErrorMsg('Please enter your email');
      return;
    }
    await loginWithEmail(loginEmail, loginPass);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur">
              <Siren className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">MediLink Healthcare</h2>
              <p className="text-xs text-red-100 font-medium">Smart Emergency Assistance Platform</p>
            </div>
          </div>
        </div>

        {/* Dynamic Step Views */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: WELCOME SCREEN */}
          {step === 'welcome' && (
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Welcome to MediLink
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Your Smart Emergency Healthcare Companion. Instant access to nearby hospitals, ambulances, blood banks, and AI triage.
                </p>
              </div>

              <div className="space-y-3 max-w-sm mx-auto pt-2">
                {/* Google Sign-In */}
                <button
                  onClick={() => { loginWithGoogle(); onClose(); }}
                  className="w-full py-3 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.15C3.21 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.21C.44 8.1 0 9.99 0 12s.44 3.9 1.21 5.44l4.11-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.21 2.64 1.21 6.56l4.11 3.15c.94-2.82 3.58-4.96 6.68-4.96z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Email Sign-In */}
                <button
                  onClick={() => setStep('login')}
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-red-500/30 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Continue with Email</span>
                </button>

                {/* Create Account */}
                <button
                  onClick={() => setStep('signup')}
                  className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Create New Account</span>
                </button>

                {/* Continue as Guest */}
                <button
                  onClick={() => { continueAsGuest(); onClose(); }}
                  className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline transition-colors"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: USER LOGIN */}
          {step === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Log In to MediLink
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                    placeholder="alex@example.com"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors"
              >
                Sign In
              </button>

              <div className="flex justify-between text-xs font-bold text-slate-500 pt-2">
                <button type="button" onClick={() => setStep('welcome')}>
                  ← Back to Options
                </button>
                <button type="button" onClick={() => setStep('signup')}>
                  New? Register Here
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: FULL USER REGISTRATION */}
          {step === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Create Medical Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Blood Group (Optional)</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
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
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl space-y-2 mt-2">
                <p className="font-extrabold text-red-700 dark:text-red-300 flex items-center">
                  <Shield className="w-3.5 h-3.5 mr-1" /> Family Emergency Contact
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    placeholder="Contact Person Name"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900 rounded-xl"
                  />
                  <input
                    type="tel"
                    value={formData.emergencyContactNumber}
                    onChange={e => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                    placeholder="Emergency Phone Number"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg transition-colors mt-2"
              >
                Proceed to OTP Verification →
              </button>
            </form>
          )}

          {/* STEP 2.5: OTP VERIFICATION */}
          {step === 'otp' && (
            <div className="text-center space-y-4 py-4">
              <KeyRound className="w-12 h-12 text-red-600 mx-auto" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">OTP Verification</h3>
                <p className="text-xs text-slate-500">
                  Enter 4-digit code sent to {formData.mobile || '+91 98765 43210'}
                </p>
              </div>

              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={e => setOtpInput(e.target.value)}
                placeholder="1 2 3 4"
                className="w-36 text-center text-2xl font-black tracking-widest p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl mx-auto block"
              />

              <button
                onClick={handleVerifyOtp}
                className="w-full max-w-xs py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors"
              >
                Verify & Complete Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
