import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ta' | 'hi';
export type Theme = 'light' | 'dark';

interface Translations {
  welcomeTitle: string;
  welcomeSubtitle: string;
  nearbyHospitals: string;
  nearbyPharmacies: string;
  nearbyAmbulances: string;
  nearbyClinics: string;
  bloodBanks: string;
  diagnosticLabs: string;
  doctors: string;
  emergencyContacts: string;
  sosButton: string;
  requestAmbulanceNow: string;
  aiAssistant: string;
  searchPlaceholder: string;
  bookAppointment: string;
  callHospital: string;
  getDirections: string;
  availableBeds: string;
  icuBeds: string;
  oxygenAvailable: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    welcomeTitle: 'Welcome to MediLink',
    welcomeSubtitle: 'Your Smart Emergency Healthcare Companion',
    nearbyHospitals: 'Nearby Hospitals',
    nearbyPharmacies: 'Nearby Medical Shops',
    nearbyAmbulances: 'Nearby Ambulances',
    nearbyClinics: 'Nearby Clinics',
    bloodBanks: 'Blood Banks',
    diagnosticLabs: 'Diagnostic Labs',
    doctors: 'Doctors',
    emergencyContacts: 'Emergency Hotline',
    sosButton: 'EMERGENCY SOS',
    requestAmbulanceNow: 'Request Ambulance Now',
    aiAssistant: 'AI Health Assistant',
    searchPlaceholder: 'Search hospitals, doctors, pharmacies, specialists...',
    bookAppointment: 'Book Appointment',
    callHospital: 'Call Hospital',
    getDirections: 'Get Directions',
    availableBeds: 'Emergency Beds Available',
    icuBeds: 'ICU Beds',
    oxygenAvailable: 'Oxygen Stocked'
  },
  ta: {
    welcomeTitle: 'மெடிலின்க்-க்கு நல்வரவு',
    welcomeSubtitle: 'உங்கள் அவசர மருத்துவ உதவியாளன்',
    nearbyHospitals: 'அருகிலுள்ள மருத்துவமனைகள்',
    nearbyPharmacies: 'அருகிலுள்ள மருந்தகங்கள்',
    nearbyAmbulances: 'ஆம்புலன்ஸ் சேவைகள்',
    nearbyClinics: 'அருகிலுள்ள கிளினிக்குகள்',
    bloodBanks: 'இரத்த வங்கிகள்',
    diagnosticLabs: 'பரிசோதனை மையங்கள்',
    doctors: 'மருத்துவர்கள்',
    emergencyContacts: 'அவசர தொடர்பு எண்கள்',
    sosButton: 'அவசர SOS',
    requestAmbulanceNow: 'உடனே ஆம்புலன்ஸ் வரவழைக்க',
    aiAssistant: 'AI மருத்துவ உதவியாளர்',
    searchPlaceholder: 'மருத்துவமனை, மருத்துவர், மருந்தகம் தேடுக...',
    bookAppointment: 'நேர முன்பதிவு',
    callHospital: 'மருத்துவமனையை அழைக்க',
    getDirections: 'வழிப்பாதை பெற',
    availableBeds: 'அவசர படுக்கைகள்',
    icuBeds: 'ICU படுக்கைகள்',
    oxygenAvailable: 'ஆக்ஸிஜன் இருப்பு'
  },
  hi: {
    welcomeTitle: 'मेडिलिंक में आपका स्वागत है',
    welcomeSubtitle: 'आपका स्मार्ट आपातकालीन स्वास्थ्य साथी',
    nearbyHospitals: 'पास के अस्पताल',
    nearbyPharmacies: 'पास की मेडिकल दुकानें',
    nearbyAmbulances: 'पास की एम्बुलेंस',
    nearbyClinics: 'पास के क्लिनिक',
    bloodBanks: 'ब्लड बैंक',
    diagnosticLabs: 'डायग्नोस्टिक लैब',
    doctors: 'डॉक्टर',
    emergencyContacts: 'आपातकालीन नंबर',
    sosButton: 'इमरजेंसी SOS',
    requestAmbulanceNow: 'अभी एम्बुलेंस बुलाएं',
    aiAssistant: 'AI स्वास्थ्य सहायक',
    searchPlaceholder: 'अस्पताल, डॉक्टर, फार्मेसी खोजें...',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    callHospital: 'अस्पताल को कॉल करें',
    getDirections: 'दिशा-निर्देश लें',
    availableBeds: 'उपलब्ध आपातकालीन बेड',
    icuBeds: 'ICU बेड',
    oxygenAvailable: 'ऑक्सीजन उपलब्ध'
  }
};

interface ThemeLanguageContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeLanguageContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        t: TRANSLATIONS[language]
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) throw new Error('useThemeLanguage must be used within ThemeLanguageProvider');
  return context;
};
