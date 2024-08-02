import { Timestamp } from 'firebase/firestore';

interface Host {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;  // bioフィールドを追加
  image?: string;  // imageフィールドも追加
}

export interface Property {
  id: string;
  title: string;
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
  icalUrls?: string[]; // iCal URLの配列を追加
  bookingLinks: BookingLink[];
  size?: number;
  bookings: Booking[];
  hostInfo: {
    name: string;
    bio: string;
    image: string;
    // 他のホスト情報のプロパティを必要に応じて追加
  };
  reviews: Review[];
  faqs: Array<{ question: string; answer: string }>;
  availableDates?: string[]; // まは Date[] 型、使用する形式に応じて
  closedDays?: string[];
  cleaningTime?: string;
  hostName?: string;
  hostDescription?: string;
  hostImageUrl?: string;
  minStayDays?: number;
  maxStayDays?: number;
  checkInTime?: string;
  checkOutTime?: string;
  sesameApiKey?: string;
  lockSystems?: LockSystem[];
  currentPasscode?: string;
  passcodeHistory?: PasscodeHistory[];
  host?: Host;
  wifiSSID?: string;
  wifiPassword?: string;
  attachedFiles?: AttachedFile[]; // string[] から AttachedFile[] に変更
  availability?: {
    availableFrom: string;
    availableTo: string;
  };
}

interface AttachedFile {
  url: string;
  name: string;
}

export type PropertyWithAttachedFiles = Property & {
  attachedFiles?: AttachedFile[];
  area: number;
};

export interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: Timestamp;
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
  totalPrice: number; // この行を追加
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

export interface PasscodeHistory {
  passcode: string;
  type: 'physical' | 'digital';
  updatedAt: string;
  updatedBy: string;
}

export interface LockSystem {
  name: string;
  apiKey: string;
}

export interface ICalImport {
  url: string;
  name?: string; // nameをオプショナルにする
}