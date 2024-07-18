import React, { createContext, useContext, useState } from 'react';
import { Property, BookingData } from '../types';

interface PropertyContextType {
  property: Property | null;
  setProperty: React.Dispatch<React.SetStateAction<Property | null>>;
  editedProperty: Property | null;
  setEditedProperty: React.Dispatch<React.SetStateAction<Property | null>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  updateProperty: (updatedProperty: Partial<Property>) => void;
  selectedStartDate: Date | null;
  setSelectedStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  selectedEndDate: Date | null;
  setSelectedEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  guestName: string;
  setGuestName: React.Dispatch<React.SetStateAction<string>>;
  onGuestNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  guestEmail: string;
  setGuestEmail: React.Dispatch<React.SetStateAction<string>>;
  onGuestEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (bookingData: BookingData) => Promise<void>;
}

export const PropertyContext = createContext<PropertyContextType | null>(null);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [editedProperty, setEditedProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');

  const updateProperty = (updatedProperty: Partial<Property>) => {
    setProperty(prev => prev ? { ...prev, ...updatedProperty } : null);
  };

  return (
    <PropertyContext.Provider value={{
      property, 
      setProperty,
      editedProperty,
      setEditedProperty,
      isEditing,
      setIsEditing,
      updateProperty,
      selectedStartDate,
      setSelectedStartDate,
      selectedEndDate,
      setSelectedEndDate,
      guestName,
      setGuestName,
      onGuestNameChange: (event) => setGuestName(event.target.value),
      guestEmail,
      setGuestEmail,
      onGuestEmailChange: (event) => setGuestEmail(event.target.value),
      onSubmit: async (bookingData: BookingData) => {
        // 予約送信のロジックをここに実装
        // 例: await sendBookingData(bookingData);
      },
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};