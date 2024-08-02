import React, { createContext, useContext, useState } from 'react';
import { Property, BookingData, ICalImport, PropertyWithAttachedFiles } from '../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // あなたのFirebase設定ファイルへのパスを確認してください

interface PropertyContextType {
  property: PropertyWithAttachedFiles | null;
  setProperty: React.Dispatch<React.SetStateAction<PropertyWithAttachedFiles | null>>;
  editedProperty: PropertyWithAttachedFiles | null;
  setEditedProperty: React.Dispatch<React.SetStateAction<PropertyWithAttachedFiles | null>>;
  updateProperty: (updatedProperty: Partial<Property>) => void;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  selectedStartDate: Date | null;
  setSelectedStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  selectedEndDate: Date | null;
  setSelectedEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  guestName: string;
  setGuestName: (name: string) => void;
  guestEmail: string;
  setGuestEmail: (email: string) => void;
  onGuestNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onGuestEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (bookingData: BookingData) => Promise<void>;
  iCalImports: ICalImport[];
  addICalImport: (newImport: ICalImport) => void;
  removeICalImport: (index: number) => void;
}

export const PropertyContext = createContext<PropertyContextType | null>(null);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [property, setProperty] = useState<PropertyWithAttachedFiles | null>(null);
  const [editedProperty, setEditedProperty] = useState<PropertyWithAttachedFiles | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [iCalImports, setICalImports] = useState<ICalImport[]>([]);

  const onGuestNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuestName(event.target.value);
  };

  const onGuestEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuestEmail(event.target.value);
  };

  const onSubmit = async (bookingData: BookingData) => {
    // ここに予約処理のロジックを実装
    console.log('Booking submitted:', bookingData);
  };

  const updateProperty = async (updates: Partial<Property>) => {
    if (property && property.id) {
      const propertyRef = doc(db, 'properties', property.id);
      await updateDoc(propertyRef, updates);
      setProperty({ ...property, ...updates });
    }
  };

  const addICalImport = (newImport: ICalImport) => {
    setICalImports([...iCalImports, newImport]);
  };

  const removeICalImport = (index: number) => {
    setICalImports(iCalImports.filter((_, i) => i !== index));
  };

  return (
    <PropertyContext.Provider value={{
      property,
      setProperty,
      editedProperty,
      setEditedProperty,
      updateProperty,
      isEditing,
      setIsEditing,
      selectedStartDate,
      setSelectedStartDate,
      selectedEndDate,
      setSelectedEndDate,
      guestName,
      setGuestName,
      guestEmail,
      setGuestEmail,
      onGuestNameChange,
      onGuestEmailChange,
      onSubmit,
      iCalImports,
      addICalImport,
      removeICalImport
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};