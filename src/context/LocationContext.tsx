import React, { createContext, useContext, useState } from 'react';
import { LocationInfo } from '../types';

interface LocationContextType {
  location: LocationInfo;
  permissionGranted: boolean;
  showPermissionModal: boolean;
  openPermissionModal: () => void;
  closePermissionModal: () => void;
  requestLocationPermission: () => Promise<void>;
  radiusKm: number;
  setRadiusKm: (r: number) => void;
  setManualCity: (cityName: string) => void;
  isLoadingLocation: boolean;
}

const DEFAULT_LOCATION: LocationInfo = {
  latitude: 13.0612,
  longitude: 80.2520,
  address: 'Greams Road, Thousand Lights, Central Chennai',
  city: 'Chennai',
  district: 'Chennai',
  state: 'Tamil Nadu',
  pincode: '600006'
};

const CITY_COORDINATES: Record<string, LocationInfo> = {
  Chennai: {
    latitude: 13.0612,
    longitude: 80.2520,
    address: 'Greams Road, Thousand Lights',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600006'
  },
  Mumbai: {
    latitude: 19.0760,
    longitude: 72.8777,
    address: 'Marine Lines, South Mumbai',
    city: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    pincode: '400020'
  },
  Delhi: {
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'Connaught Place, Central Delhi',
    city: 'Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    pincode: '110001'
  },
  Bengaluru: {
    latitude: 12.9716,
    longitude: 77.5946,
    address: 'MG Road, Indiranagar',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    pincode: '560001'
  },
  Hyderabad: {
    latitude: 17.3850,
    longitude: 78.4867,
    address: 'Banjara Hills, Road No 1',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034'
  }
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationInfo>(DEFAULT_LOCATION);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(true);
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

  const openPermissionModal = () => setShowPermissionModal(true);
  const closePermissionModal = () => setShowPermissionModal(false);

  const requestLocationPermission = async () => {
    setIsLoadingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocation({
            latitude: lat,
            longitude: lng,
            address: 'Detected Live GPS Coordinates',
            city: 'Live Location',
            district: 'Local District',
            state: 'Tamil Nadu',
            pincode: '600001'
          });
          setPermissionGranted(true);
          setIsLoadingLocation(false);
          closePermissionModal();
        },
        () => {
          // Fallback to default
          setPermissionGranted(true);
          setIsLoadingLocation(false);
          closePermissionModal();
        },
        { timeout: 10000 }
      );
    } else {
      setPermissionGranted(true);
      setIsLoadingLocation(false);
      closePermissionModal();
    }
  };

  const setManualCity = (cityName: string) => {
    if (CITY_COORDINATES[cityName]) {
      setLocation(CITY_COORDINATES[cityName]);
    } else {
      setLocation({
        ...DEFAULT_LOCATION,
        city: cityName,
        address: `${cityName} Center`
      });
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        permissionGranted,
        showPermissionModal,
        openPermissionModal,
        closePermissionModal,
        requestLocationPermission,
        radiusKm,
        setRadiusKm,
        setManualCity,
        isLoadingLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProviderComponent');
  return context;
};
