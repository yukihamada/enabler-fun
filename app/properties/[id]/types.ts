import { Timestamp } from 'firebase/firestore';

export interface Property {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  surroundings: string;
  smokingAllowed: boolean;
  petsAllowed: boolean;
  wifiInfo: string;
  cleaningFee: number;
  parking: string;
  cancellationPolicy: string;
  nearbyAttractions: string[];
  furnishings: string[];
  availableFrom: Timestamp;
  availableTo: Timestamp;
  specialOffers: string[];
  latitude: number;
  longitude: number;
  icalUrl?: string;
  bookingLinks: BookingLink[];
  size?: number;
  bookings: Booking[];
  title: string;
}

export interface BookingLink {
  type: 'airbnb' | 'booking' | 'vrbo' | 'other';
  url: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  guestName: string;
  guestEmail: string;
}

export interface BookingData {
  startDate: Date;
  endDate: Date;
  guestName: string;
  guestEmail: string;
}

export interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
}

export interface PropertyContextType {
  // ... existing properties ...
  guestName: string;
  setGuestName: React.Dispatch<React.SetStateAction<string>>;
  guestEmail: string;
  setGuestEmail: React.Dispatch<React.SetStateAction<string>>;
}