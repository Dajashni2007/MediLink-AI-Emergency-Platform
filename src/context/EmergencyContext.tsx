import React, { createContext, useContext, useState } from 'react';
import { Appointment, EmergencyRequest, MedicineOrder, NotificationItem } from '../types';

interface EmergencyContextType {
  isSosActive: boolean;
  activeSosRequest: EmergencyRequest | null;
  triggerSOS: (note?: string) => Promise<EmergencyRequest>;
  cancelSOS: () => void;
  requestAmbulance: (type: string, hospitalName?: string) => Promise<EmergencyRequest>;
  appointments: Appointment[];
  bookAppointment: (data: Omit<Appointment, 'id' | 'status' | 'qrCodeData' | 'createdAt'>) => Promise<Appointment>;
  medicineOrders: MedicineOrder[];
  placeMedicineOrder: (data: Omit<MedicineOrder, 'id' | 'status' | 'timestamp'>) => Promise<MedicineOrder>;
  emergencyRequests: EmergencyRequest[];
  updateEmergencyStatus: (id: string, status: EmergencyRequest['status'], eta?: number) => void;
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_101',
    hospitalId: 'h1',
    hospitalName: 'Apollo Emergency & Trauma Superspeciality Center',
    doctorId: 'd1',
    doctorName: 'Dr. Rajesh Subramanian',
    doctorSpecialization: 'Interventional Cardiologist',
    date: '2026-07-28',
    timeSlot: '10:30 AM',
    patientName: 'Alex Morgan',
    patientMobile: '+91 98765 43210',
    reason: 'Routine Cardiac Checkup & ECG Review',
    status: 'Confirmed',
    qrCodeData: 'MEDILINK-PASS-APT101-APOLLO',
    createdAt: '2026-07-25 14:30'
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Emergency Medical Hotline Ready',
    message: 'MediLink live emergency services and 24x7 ambulance dispatch active in your area.',
    type: 'system',
    timestamp: '10 mins ago',
    read: false
  },
  {
    id: 'notif_2',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Rajesh Subramanian is confirmed for July 28 at 10:30 AM.',
    type: 'appointment',
    timestamp: '1 hour ago',
    read: false
  }
];

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSosActive, setIsSosActive] = useState<boolean>(false);
  const [activeSosRequest, setActiveSosRequest] = useState<EmergencyRequest | null>(null);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [medicineOrders, setMedicineOrders] = useState<MedicineOrder[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const item: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [item, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const triggerSOS = async (note?: string): Promise<EmergencyRequest> => {
    const req: EmergencyRequest = {
      id: `SOS_${Date.now()}`,
      userId: 'usr_current',
      userName: 'Alex Morgan',
      userMobile: '+91 98765 43210',
      location: {
        lat: 13.0612,
        lng: 80.2520,
        address: 'Greams Road, Thousand Lights, Chennai'
      },
      type: 'SOS',
      status: 'Dispatched',
      assignedAmbulanceId: 'amb1',
      assignedAmbulanceNumber: 'TN-01-AX-1081',
      assignedDriverName: 'Senthil Kumar (Certified EMT)',
      assignedDriverContact: '+91 98401 10811',
      etaMinutes: 4,
      timestamp: new Date().toLocaleTimeString(),
      notes: note || 'High Priority Emergency SOS Triggered'
    };

    setActiveSosRequest(req);
    setIsSosActive(true);
    setEmergencyRequests(prev => [req, ...prev]);

    // Send API call to server
    try {
      await fetch('/api/emergency/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
    } catch (e) {
      console.error(e);
    }

    addNotification(
      '🚨 EMERGENCY SOS DISPATCHED',
      'Nearest ICU Ambulance (TN-01-AX-1081) dispatched! Driver Senthil Kumar en route (ETA: 4 mins). Apollo Emergency Trauma Center notified.',
      'emergency'
    );

    return req;
  };

  const cancelSOS = () => {
    setIsSosActive(false);
    if (activeSosRequest) {
      setEmergencyRequests(prev =>
        prev.map(r => r.id === activeSosRequest.id ? { ...r, status: 'Completed' } : r)
      );
    }
    setActiveSosRequest(null);
  };

  const requestAmbulance = async (type: string, hospitalName?: string): Promise<EmergencyRequest> => {
    const req: EmergencyRequest = {
      id: `AMB_${Date.now()}`,
      userId: 'usr_current',
      userName: 'Alex Morgan',
      userMobile: '+91 98765 43210',
      location: {
        lat: 13.0612,
        lng: 80.2520,
        address: 'Greams Road, Thousand Lights, Chennai'
      },
      type: 'Ambulance',
      status: 'Dispatched',
      assignedAmbulanceId: 'amb1',
      assignedAmbulanceNumber: 'TN-01-AX-1081',
      assignedDriverName: 'Senthil Kumar (Certified EMT)',
      assignedDriverContact: '+91 98401 10811',
      etaMinutes: 5,
      timestamp: new Date().toLocaleTimeString(),
      notes: `Requested ${type} for ${hospitalName || 'Nearest Trauma Center'}`
    };

    setActiveSosRequest(req);
    setIsSosActive(true);
    setEmergencyRequests(prev => [req, ...prev]);

    addNotification(
      '🚑 Ambulance En Route',
      `${type} dispatched to your location. Driver contact: +91 98401 10811 (ETA 5 mins).`,
      'ambulance'
    );

    return req;
  };

  const bookAppointment = async (data: Omit<Appointment, 'id' | 'status' | 'qrCodeData' | 'createdAt'>): Promise<Appointment> => {
    const newApt: Appointment = {
      ...data,
      id: `apt_${Date.now()}`,
      status: 'Confirmed',
      qrCodeData: `MEDILINK-APT-${Date.now()}-${data.hospitalName.substring(0, 4).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newApt, ...prev]);

    addNotification(
      'Appointment Confirmed',
      `Appointment booked with ${data.doctorName} at ${data.hospitalName} on ${data.date} at ${data.timeSlot}.`,
      'appointment'
    );

    return newApt;
  };

  const placeMedicineOrder = async (data: Omit<MedicineOrder, 'id' | 'status' | 'timestamp'>): Promise<MedicineOrder> => {
    const order: MedicineOrder = {
      ...data,
      id: `ord_${Date.now()}`,
      status: 'Received',
      timestamp: new Date().toLocaleTimeString()
    };

    setMedicineOrders(prev => [order, ...prev]);

    addNotification(
      'Medicine Order Placed',
      `Order placed with ${data.pharmacyName}. Delivery partner will contact you shortly.`,
      'system'
    );

    return order;
  };

  const updateEmergencyStatus = (id: string, status: EmergencyRequest['status'], eta?: number) => {
    setEmergencyRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status, etaMinutes: eta ?? r.etaMinutes } : r)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <EmergencyContext.Provider
      value={{
        isSosActive,
        activeSosRequest,
        triggerSOS,
        cancelSOS,
        requestAmbulance,
        appointments,
        bookAppointment,
        medicineOrders,
        placeMedicineOrder,
        emergencyRequests,
        updateEmergencyStatus,
        notifications,
        addNotification,
        markNotificationRead,
        unreadCount
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) throw new Error('useEmergency must be used within EmergencyProviderComponent');
  return context;
};
