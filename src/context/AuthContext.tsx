import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AuthProvider as AuthProviderKind } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalStep: 'welcome' | 'login' | 'signup' | 'otp';
  openAuthModal: (step?: 'welcome' | 'login' | 'signup' | 'otp') => void;
  closeAuthModal: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  signupWithEmail: (data: Partial<UserProfile>) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  switchRole: (role: UserRole) => void;
  savedHospitalIds: string[];
  savedDoctorIds: string[];
  toggleSaveHospital: (id: string) => void;
  toggleSaveDoctor: (id: string) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_default',
  name: 'Alex Morgan',
  email: 'alex.m@medilink.org',
  mobile: '+91 98765 43210',
  dob: '1995-08-14',
  gender: 'Male',
  bloodGroup: 'O+',
  emergencyContactName: 'Sarah Morgan (Wife)',
  emergencyContactNumber: '+91 98765 00001',
  address: 'No. 42, Green Avenue, Nungambakkam, Chennai',
  role: 'user',
  authProvider: 'google',
  isVerified: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('medilink_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalStep, setAuthModalStep] = useState<'welcome' | 'login' | 'signup' | 'otp'>('welcome');
  const [savedHospitalIds, setSavedHospitalIds] = useState<string[]>(['h1', 'h3']);
  const [savedDoctorIds, setSavedDoctorIds] = useState<string[]>(['d1']);

  useEffect(() => {
    if (user) {
      localStorage.setItem('medilink_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('medilink_user');
    }
  }, [user]);

  const openAuthModal = (step: 'welcome' | 'login' | 'signup' | 'otp' = 'welcome') => {
    setAuthModalStep(step);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginWithEmail = async (email: string): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0] || 'User',
      email,
      mobile: '+91 98765 12345',
      emergencyContactName: 'Family Contact',
      emergencyContactNumber: '+91 98765 00000',
      role: 'user',
      authProvider: 'email',
      isVerified: true
    };
    setUser(newUser);
    closeAuthModal();
    return true;
  };

  const signupWithEmail = async (data: Partial<UserProfile>): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: data.name || 'New User',
      email: data.email || 'user@example.com',
      mobile: data.mobile || '+91 98000 00000',
      dob: data.dob,
      gender: data.gender,
      bloodGroup: data.bloodGroup || 'O+',
      emergencyContactName: data.emergencyContactName || 'Family Contact',
      emergencyContactNumber: data.emergencyContactNumber || '+91 98000 11111',
      role: 'user',
      authProvider: 'email',
      isVerified: true
    };
    setUser(newUser);
    closeAuthModal();
    return true;
  };

  const loginWithGoogle = async () => {
    const googleUser: UserProfile = {
      id: `usr_google_${Date.now()}`,
      name: 'Dr. Jane Doe',
      email: 'jane.doe@gmail.com',
      mobile: '+91 99400 12345',
      bloodGroup: 'A+',
      emergencyContactName: 'David Doe (Brother)',
      emergencyContactNumber: '+91 99400 54321',
      role: 'user',
      authProvider: 'google',
      isVerified: true
    };
    setUser(googleUser);
    closeAuthModal();
  };

  const continueAsGuest = () => {
    const guestUser: UserProfile = {
      id: `guest_${Date.now()}`,
      name: 'Guest User',
      email: 'guest@medilink.org',
      mobile: '+91 00000 00000',
      emergencyContactName: 'Primary Contact',
      emergencyContactNumber: '+91 10800 00000',
      role: 'user',
      authProvider: 'guest',
      isVerified: false
    };
    setUser(guestUser);
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const toggleSaveHospital = (id: string) => {
    setSavedHospitalIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSaveDoctor = (id: string) => {
    setSavedDoctorIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && user.authProvider !== 'guest',
        isAuthModalOpen,
        authModalStep,
        openAuthModal,
        closeAuthModal,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        continueAsGuest,
        logout,
        updateProfile,
        switchRole,
        savedHospitalIds,
        savedDoctorIds,
        toggleSaveHospital,
        toggleSaveDoctor
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProviderComponent');
  return context;
};
