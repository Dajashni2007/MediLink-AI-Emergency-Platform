export type UserRole = 'user' | 'hospital' | 'pharmacy' | 'admin';
export type AuthProvider = 'email' | 'google' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  address?: string;
  role: UserRole;
  authProvider: AuthProvider;
  isVerified?: boolean;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

export interface Hospital {
  id: string;
  logo: string;
  photo: string;
  name: string;
  type: 'Government' | 'Private';
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  distanceKm: number;
  contactNumber: string;
  emergencyNumber: string;
  whatsappNumber: string;
  email: string;
  website: string;
  rating: number;
  reviewsCount: number;
  isOpen: boolean;
  openingHours: string;
  emergencyAvailable: boolean;
  icuBedsAvailable: number;
  totalIcuBeds: number;
  emergencyBedsAvailable: number;
  generalBedsAvailable: number;
  oxygenAvailable: boolean;
  bloodBankAvailable: boolean;
  pharmacyAvailable: boolean;
  ambulanceAvailable: boolean;
  departments: string[];
  doctorsTodayCount: number;
  estWaitingTimeMin: number;
  saved?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  photo: string;
  qualification: string;
  specialization: string;
  experienceYears: number;
  hospitalId: string;
  hospitalName: string;
  clinicAddress: string;
  contactNumber: string;
  email: string;
  availableToday: boolean;
  inClinicNow: boolean;
  nextAvailableSlot: string;
  consultationFee: number;
  languagesSpoken: string[];
  status: 'available' | 'busy' | 'unavailable';
  rating: number;
  reviewsCount: number;
}

export interface Pharmacy {
  id: string;
  photo: string;
  name: string;
  isOpen: boolean;
  is24x7: boolean;
  address: string;
  city: string;
  contactNumber: string;
  distanceKm: number;
  lat: number;
  lng: number;
  homeDelivery: boolean;
  acceptedPayments: string[];
  rating: number;
  reviewsCount: number;
  stockCategories?: string[];
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhoto: string;
  contactNumber: string;
  distanceKm: number;
  lat: number;
  lng: number;
  etaMinutes: number;
  type: 'Basic Life Support (BLS)' | 'Advanced Life Support (ALS)' | 'ICU Ambulance';
  status: 'Available' | 'Busy' | 'En Route';
  hospitalAffiliation: string;
}

export interface BloodBank {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  distanceKm: number;
  is24x7: boolean;
  lat: number;
  lng: number;
  bloodGroupStock: {
    'A+': number;
    'A-': number;
    'B+': number;
    'B-': number;
    'O+': number;
    'O-': number;
    'AB+': number;
    'AB-': number;
  };
}

export interface DiagnosticLab {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  distanceKm: number;
  rating: number;
  homeSampleCollection: boolean;
  testsOffered: string[];
  lat: number;
  lng: number;
}

export interface Appointment {
  id: string;
  hospitalId: string;
  hospitalName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  timeSlot: string;
  patientName: string;
  patientMobile: string;
  reason: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  qrCodeData: string;
  createdAt: string;
}

export interface EmergencyRequest {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  type: 'SOS' | 'Ambulance' | 'Accident' | 'Women Support' | 'Senior Assist';
  status: 'Pending' | 'Dispatched' | 'Arrived' | 'Completed';
  assignedAmbulanceId?: string;
  assignedAmbulanceNumber?: string;
  assignedDriverName?: string;
  assignedDriverContact?: string;
  etaMinutes?: number;
  timestamp: string;
  notes?: string;
}

export interface MedicineOrder {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  items: string[];
  prescriptionImage?: string;
  patientName: string;
  patientMobile: string;
  deliveryAddress: string;
  totalAmount: number;
  status: 'Received' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'appointment' | 'system' | 'ambulance';
  timestamp: string;
  read: boolean;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  mobile: string;
  city: string;
  lastDonatedDate: string;
  availableForEmergency: boolean;
}
