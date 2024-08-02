export interface Property {
  id: string;
  name: string;
  title: string;
  icon: string;
  type: 'property', // デフォルト値を追加
  isPremium: false,
  description: string;
  address: string;
  price: number;
  priceUnit?: string;
  cleaningFee?: number;
  dailyRate?: number;
  monthlyRate?: number;
  area?: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  furnishings?: string[];
  imageUrls: string[];
  latitude?: number;
  longitude?: number;
  checkInTime: string;
  checkOutTime: string;
  availableFrom: string | Date;
  availableTo: string | Date;
  availableDates?: string[];
  cancellationPolicy: string;
  houseRules?: string[];
  petsAllowed: boolean;
  smokingAllowed: boolean;
  parking: string;
  wifiInfo: string;
  nearbyStations?: string[];
  nearbyAttractions?: string[];
  nearbyFacilities?: NearbyFacility[];
  minimumRentalHours?: number; // 初期値はコンストラクタで設定できます。
  surroundings?: string;
  specialOffers?: string[];
  ownershipType?: string;
  status?: string;
  bookingLinks?: BookingLink[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  icalUrls?: string[];
  calendarBookings?: {
    [key: string]: number;
  };
  additionalInfo?: string;
}

interface NearbyFacility {
  name: string;
  type?: string;
  distance?: number;
}

interface BookingLink {
  type: string;
  url: string;
}

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}