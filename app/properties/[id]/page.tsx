"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, onSnapshot, collection, getDocs, query, where, addDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Typography, Paper, Grid, Container, Skeleton, Button, TextField, Chip, IconButton, Checkbox, FormControlLabel, TextareaAutosize, Fab, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel, Stepper, Step, StepLabel, Box } from '@mui/material';
import Image from 'next/image';
import Layout from '../../../components/Layout';
import { FaBed, FaBath, FaRuler, FaWifi, FaSnowflake, FaCar, FaUtensils, FaTshirt, FaSnowman, FaSubway, FaShoppingCart, FaTree, FaSchool, FaCocktail, FaSpa, FaCalendarAlt, FaMoneyBillWave, FaInfoCircle, FaMapMarkerAlt, FaClipboardList, FaUserFriends, FaSmoking, FaPaw, FaParking, FaFileContract, FaMapMarkedAlt, FaTools, FaExclamationTriangle, FaLock, FaClipboard, FaTrash, FaAirbnb, FaBook, FaGlobe } from 'react-icons/fa';
import { MdEdit as EditIcon, MdSave as SaveIcon, MdCancel as CancelIcon, MdDelete as DeleteIcon, MdAdd as AddIcon } from 'react-icons/md';
import { Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../lib/firebase';
import Script from 'next/script';
import MapComponent from '../../../components/MapComponent';
import Calendar from '../../../components/Calendar';
import { SelectChangeEvent } from '@mui/material/Select';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

interface NearbyFacility {
  type: string;
  name: string;
  distance?: number;
}

interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  imageUrls: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[] | string | undefined;
  surroundings: string;
  price?: number;
  nearbyFacilities?: NearbyFacility[];
  checkInTime?: string;
  checkOutTime?: string;
  maxGuests?: number;
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
  wifiInfo?: string;
  cleaningFee?: number;
  parking?: string;
  cancellationPolicy?: string;
  nearbyAttractions: string[];
  furnishings: string[];
  specialOffers: string[];
  availableFrom?: Timestamp;
  availableTo?: Timestamp;
  latitude?: number;
  longitude?: number;
  icalUrl?: string;
  bookingLinks?: BookingLink[];
}

interface BookingLink {
  url: string;
  type: 'airbnb' | 'booking' | 'other';
}

type AmenityKey = keyof typeof amenityIcons;

const amenityIcons = {
  'Wi-Fi': FaWifi,
  'エアコン': FaSnowflake,
  '駐車場': FaCar,
  'キッチン': FaUtensils,
  '洗濯機': FaTshirt,
  '冷蔵庫': FaSnowman,
} as const;

const formatDate = (date: Timestamp | Date | undefined) => {
  if (!date) return '未設定';
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString('ja-JP');
  }
  if (date instanceof Date) {
    return date.toLocaleDateString('ja-JP');
  }
  return '無効な日時';
};

const renderValue = (value: any): string => {
  if (value === null || value === undefined) return 'データなし';
  if (value instanceof Timestamp) return formatDate(value);
  if (value instanceof Date) return formatDate(value);
  if (Array.isArray(value)) return value.map(renderValue).join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  status: 'pending' | 'confirmed' | 'cancelled';
  guestName: string;
  guestEmail: string;
}

interface BookingFormData {
  name: string;
  phoneNumber: string;
  email: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
}

const BookingDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: BookingFormData) => void;
  startDate: string;
  endDate: string;
}> = ({ open, onClose, onSubmit, startDate, endDate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phoneNumber: '',
    email: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const steps = [
    { label: '個人情報', content: (
      <>
        <TextField
          fullWidth
          name="name"
          label="お名前"
          value={formData.name}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          name="email"
          label="メールアドレス"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          margin="normal"
          required
        />
      </>
    )},
    { label: '連絡先', content: (
      <TextField
        fullWidth
        name="phoneNumber"
        label="電話番号"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        margin="normal"
        required
      />
    )},
    { label: '日程確認', content: (
      <Typography>
        {startDate && endDate && 
          `${new Date(startDate).toLocaleDateString('ja-JP')}から
           ${new Date(endDate).toLocaleDateString('ja-JP')}まで予約します。`}
      </Typography>
    )},
    { label: '支払い情報', content: (
      <>
        <TextField
          fullWidth
          name="cardNumber"
          label="クレジットカード番号"
          value={formData.cardNumber}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          name="cardExpiry"
          label="有効期限 (MM/YY)"
          value={formData.cardExpiry}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          name="cardCVC"
          label="キュリティコード (CVC)"
          value={formData.cardCVC}
          onChange={handleInputChange}
          margin="normal"
          required
        />
      </>
    )},
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>予約確認</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt={2}>
          {steps[activeStep].content}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>戻る</Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext}>次へ</Button>
        ) : (
          <Button onClick={handleSubmit} color="primary">予約を確定する</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Stripeの公開キーを使用してStripeオブジェクトを初期化
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PropertyDetail() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [editedProperty, setEditedProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isRealTimeUpdating, setIsRealTimeUpdating] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [user, userLoading, userError] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsers, setAdminUsers] = useState<string[]>([]);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [calendarEvents, setCalendarEvents] = useState<{ start: Date; end: Date; title: string }[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const [icalUrl, setIcalUrl] = useState('');
  const [icalToken, setIcalToken] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const router = useRouter();
  const [newBookingLink, setNewBookingLink] = useState<BookingLink>({ url: '', type: 'other' });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [icalData, setIcalData] = useState('');
  const [parsedEvents, setParsedEvents] = useState<{ start: Date; end: Date; title: string }[]>([]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const propertyData = { id: docSnap.id, ...docSnap.data() } as Property;
          propertyData.amenities = (() => {
            if (Array.isArray(propertyData.amenities)) {
              return propertyData.amenities;
            }
            if (typeof propertyData.amenities === 'string') {
              return propertyData.amenities.split(',').map(item => item.trim());
            }
            return [];
          })() as string[];
          
          propertyData.imageUrls = (Array.isArray(propertyData.imageUrls)
            ? propertyData.imageUrls
            : typeof propertyData.imageUrls === 'string'
              ? [propertyData.imageUrls as string]
              : []) as string[];

          propertyData.nearbyAttractions = Array.isArray(propertyData.nearbyAttractions)
            ? propertyData.nearbyAttractions
            : [];

          propertyData.furnishings = Array.isArray(propertyData.furnishings)
            ? propertyData.furnishings
            : [];

          propertyData.specialOffers = Array.isArray(propertyData.specialOffers)
            ? propertyData.specialOffers
            : [];

          setProperty(propertyData);
          setEditedProperty(propertyData);
        } else {
          console.log('物がつかりません');
        }
      } catch (error) {
        console.error('物件データの取得中にエラーが発生しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();

    // リアルタイム更新のためのリスナーを設定
    let unsubscribe: () => void;
    if (isEditing && id) {
      const docRef = doc(db, 'properties', id);
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const propertyData = { id: docSnap.id, ...docSnap.data() } as Property;
          setEditedProperty(propertyData);
          setIsRealTimeUpdating(true);
        }
      });
    }

    // クリーンアップ関数
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [id, isEditing]);

  useEffect(() => {
    const fetchAdminUsers = async () => {
      const adminUsersCollection = collection(db, 'adminUsers');
      const adminUsersSnapshot = await getDocs(adminUsersCollection);
      const adminUsersList = adminUsersSnapshot.docs.map(doc => doc.data().email);
      setAdminUsers(adminUsersList);
    };

    const checkAdminStatus = async () => {
      if (user && user.email) {
        const adminUsersCollection = collection(db, 'adminUsers');
        const q = query(adminUsersCollection, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        const isAdminUser = !querySnapshot.empty;
        setIsAdmin(isAdminUser);

      } else {
        setIsAdmin(false);
      }
    };

    fetchAdminUsers();
    checkAdminStatus();
  }, [user, adminUsers]);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const response = await axios.get('/api/bookings/ical?propertyId=VA6yl9e8Z5yhJQ2nGs8i');
        const icalData = response.data;
        setIcalData(icalData);

        const events = parseICalData(icalData);
        setParsedEvents(events);
        
        setCalendarEvents(events);
      } catch (error) {
        console.error('iCalデータの取得に失敗しました:', error);
      }
    };

    fetchCalendarData();
  }, []);

  const parseICalData = (icalData: string) => {
    const events: { start: Date; end: Date; title: string }[] = [];
    const lines = icalData.split('\n');
    let currentEvent: { start: Date | null; end: Date | null; title: string } | null = null;

    for (const line of lines) {
      if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = { start: null, end: null, title: '予約あり' };
      } else if (line.startsWith('END:VEVENT')) {
        if (currentEvent && currentEvent.start && currentEvent.end) {
          // チェックアウト日の前日を終了日とする
          const endDate = new Date(currentEvent.end);
          endDate.setDate(endDate.getDate() - 1);
          events.push({
            start: currentEvent.start,
            end: endDate,
            title: currentEvent.title
          });
        }
        currentEvent = null;
      } else if (currentEvent) {
        if (line.startsWith('DTSTART:')) {
          currentEvent.start = parseICalDate(line.substring(8));
        } else if (line.startsWith('DTEND:')) {
          currentEvent.end = parseICalDate(line.substring(6));
        } else if (line.startsWith('SUMMARY:')) {
          currentEvent.title = line.substring(8).trim();
        }
      }
    }

    return events;
  };

  const parseICalDate = (dateString: string): Date => {
    // iCal日付形式: YYYYMMDDTHHMMSSZ
    const year = parseInt(dateString.substr(0, 4), 10);
    const month = parseInt(dateString.substr(4, 2), 10) - 1; // JavaScriptの月は0-11
    const day = parseInt(dateString.substr(6, 2), 10);
    const hour = parseInt(dateString.substr(9, 2), 10);
    const minute = parseInt(dateString.substr(11, 2), 10);
    const second = parseInt(dateString.substr(13, 2), 10);

    return new Date(Date.UTC(year, month, day, hour, minute, second));
  };


  useEffect(() => {
    const generateAvailableDates = () => {
      const dates = [];
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 365); // 1間の日付を生成

      for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
        const currentDate = new Date(d);
        const isAvailable = !calendarEvents.some(event => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          return currentDate >= eventStart && currentDate < eventEnd;
        });

        if (isAvailable) {
          dates.push(new Date(currentDate));
        }
      }
      setAvailableDates(dates);
    };

    generateAvailableDates();
  }, [calendarEvents]);

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (property) {
      const editedProp: Property = {
        ...property,
        imageUrls: Array.isArray(property.imageUrls) ? property.imageUrls :
                   typeof property.imageUrls === 'string' ? [property.imageUrls] : [],
        amenities: Array.isArray(property.amenities) ? property.amenities :
                   typeof property.amenities === 'string' ? property.amenities.split(',').map(item => item.trim()) :
                   [],
        nearbyAttractions: Array.isArray(property.nearbyAttractions) ? property.nearbyAttractions : [],
        furnishings: Array.isArray(property.furnishings) ? property.furnishings : [],
        specialOffers: Array.isArray(property.specialOffers) ? property.specialOffers : [],
      };
      setEditedProperty(editedProp);
    }
    setIsRealTimeUpdating(false);
  };

  const handleSave = async () => {
    if (!editedProperty) return;
    try {
      const { id, ...updateData } = editedProperty;
      
      // 保前配列プロパテを確認
      updateData.imageUrls = Array.isArray(updateData.imageUrls) ? updateData.imageUrls : [];
      updateData.nearbyAttractions = Array.isArray(updateData.nearbyAttractions) ? updateData.nearbyAttractions : [];
      updateData.furnishings = Array.isArray(updateData.furnishings) ? updateData.furnishings : [];
      updateData.specialOffers = Array.isArray(updateData.specialOffers) ? updateData.specialOffers : [];
      updateData.amenities = Array.isArray(updateData.amenities) ? updateData.amenities : [];
      
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, updateData);
      setProperty(editedProperty);
      setIsEditing(false);
      setIsRealTimeUpdating(false);
    } catch (error) {
      console.error('物件の更新中エラーが発生した:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProperty(null);
    setIsRealTimeUpdating(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setEditedProperty(prev => {
      if (!prev) return null;
      if (name === 'availableFrom' || name === 'availableTo') {
        // 日付入場合、Firestore のタイムスタンプ形式に変換
        const date = new Date(value);
        return { ...prev, [name]: Timestamp.fromDate(date) };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleArrayInputChange = (name: string, value: string[] | { name: string; distance: number }[]) => {
    setEditedProperty(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleNearbyFacilitiesChange = (facilitiesText: string) => {
    const parsedFacilities = facilitiesText.split('\n').map(line => {
      const [type, name, distanceStr] = line.split(',').map(item => item.trim());
      const distance = distanceStr ? parseFloat(distanceStr) : undefined;
      return { type, name, distance };
    });

    setEditedProperty(prev => {
      if (!prev) return null;
      return { ...prev, nearbyFacilities: parsedFacilities };
    });
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim() !== '') {
      setEditedProperty(prev => {
        if (!prev) return null;
        return {
          ...prev,
          imageUrls: [...(prev.imageUrls || []), newImageUrl.trim()]
        };
      });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setEditedProperty(prev => {
      if (!prev) return null;
      const newImageUrls = [...prev.imageUrls];
      newImageUrls.splice(index, 1);
      return { ...prev, imageUrls: newImageUrls };
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const storageRef = ref(storage, `property_images/${editedProperty?.id || 'unknown'}/${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // URLが有効であることを確認
        if (downloadURL && (downloadURL.startsWith('http://') || downloadURL.startsWith('https://'))) {
          setEditedProperty(prev => {
            if (!prev) return null;
            return {
              ...prev,
              imageUrls: [...(prev.imageUrls || []), downloadURL]
            };
          });
        } else {
          console.error('Invalid image URL:', downloadURL);
        }
        setUploadedFile(null);
      } catch (error) {
        console.error('画像のアップロード中にエラーが発生しました:', error);
        setUploadedFile(null);
      }
    }
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const handleDateClick = useCallback((date: Date) => {
    if (!selectedStartDate) {
      setSelectedStartDate(date.toISOString());
    } else if (!selectedEndDate && date > new Date(selectedStartDate)) {
      setSelectedEndDate(date.toISOString());
      setIsBookingDialogOpen(true);
    } else {
      setSelectedStartDate(date.toISOString());
      setSelectedEndDate('');
    }
  }, [selectedStartDate, selectedEndDate]);

  const handleCloseBookingDialog = () => {
    setIsBookingDialogOpen(false);
    setSelectedStartDate('');
    setSelectedEndDate('');
  };

  const handleStartDateChange = (event: SelectChangeEvent<string>) => {
    const newStartDate = event.target.value;
    if (availableDates.some(date => date.toISOString() === newStartDate)) {
      setSelectedStartDate(newStartDate);
      setSelectedEndDate(''); // チェックイン日が変更されたらチェックアウト日をリセット
    } else {
      console.error('選択された日付が利用可能な日付の範囲外す');
      setSelectedStartDate('');
    }
  };

  const handleEndDateChange = (event: SelectChangeEvent<string>) => {
    const newEndDate = event.target.value;
    if (availableDates.some(date => date.toISOString() === newEndDate)) {
      setSelectedEndDate(newEndDate);
    } else {
      console.error('選択された日付が利用可能な日付の範囲外です');
      setSelectedEndDate('');
    }
  };

  const handleBookingSubmit = async (formData: BookingFormData) => {
    if (!user || !selectedStartDate || !selectedEndDate || !property) {
      console.error('予約に必要な情報不足しています');
      return;
    }

    try {
      const bookingData: Booking = {
        id: doc(collection(db, 'bookings')).id,
        propertyId: property.id,
        userId: user.uid,
        guestName: formData.name,
        guestEmail: formData.email,
        startDate: Timestamp.fromDate(new Date(selectedStartDate)),
        endDate: Timestamp.fromDate(new Date(selectedEndDate)),
        status: 'pending',
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      console.log('予約が作成されました。ID:', docRef.id);
      alert('予約が完了しました。');
      setIsBookingDialogOpen(false);
      setSelectedStartDate('');
      setSelectedEndDate('');
    } catch (error) {
      console.error('予約の作成中にエラが発生しました:', error);
      alert('予約の成中にエラーがしました。もう一度お試しくだい。');
    }
  };

  useEffect(() => {
    const generateIcalToken = async () => {
      if (property && isAdmin) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const idToken = await user.getIdToken();
          const tokenDoc = await getDoc(doc(db, 'icalTokens', property.id));
          if (tokenDoc.exists()) {
            setIcalToken(tokenDoc.data().token);
          } else {
            const newToken = Math.random().toString(36).substr(2, 10);
            await setDoc(doc(db, 'icalTokens', property.id), { token: newToken });
            setIcalToken(newToken);
          }
          setIcalUrl(`${window.location.origin}/api/bookings/ical?propertyId=${property.id}&token=${icalToken}`);
        }
      }
    };

    generateIcalToken();
  }, [property, isAdmin, icalToken]);

  const regenerateToken = async () => {
    if (property && isAdmin) {
      const newToken = Math.random().toString(36).substr(2, 10);
      await setDoc(doc(db, 'icalTokens', property.id), { token: newToken });
      setIcalToken(newToken);
      setIcalUrl(`${window.location.origin}/api/bookings/ical?propertyId=${property.id}&token=${newToken}`);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (property && isAdmin) {
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('propertyId', '==', property.id));
        const querySnapshot = await getDocs(q);
        const fetchedBookings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Booking[];
        setBookings(fetchedBookings);
      }
    };

    fetchBookings();
  }, [property, isAdmin]);

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm('この予約を削除してもよろしいすか？')) {
      try {
        await deleteDoc(doc(db, 'bookings', bookingId));
        setBookings(bookings.filter(booking => booking.id !== bookingId));
        alert('予約が正常に削除されました。');
      } catch (error) {
        console.error('約の削除中にラーが発生しました:', error);
        alert('予約の削除中にエラーが発生しました。');
      }
    }
  };

  const handleBooking = () => {
    if (!selectedStartDate || !selectedEndDate || !property) {
      alert('日付を選択してください。');
      return;
    }
    setShowBookingForm(true);
  };

  const handleSubmitBooking = async () => {
    if (!selectedStartDate || !selectedEndDate || !property || !guestName || !guestEmail) {
      alert('すべての情報を入力してください。');
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property.id,
          startDate: selectedStartDate,
          endDate: selectedEndDate,
          price: property.price,
          guestName,
          guestEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'チェックアウトセッションの作成に失敗しました');
      }

      const { sessionId } = await response.json();
      console.log('セッションID:', sessionId);
      
      // Stripeのチェックアウトページにリダイレクト
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripeチェックアウトエラー:', error);
        alert('チェックアウトプロセス中にエラーが発生しました。もう一度お試しください。');
      }
    } catch (error: unknown) {
      console.error('チェックアウトセッションの作成中にエラーが発生しました:', error);
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      alert(`予約処理中にエラーが発生しました: ${errorMessage}`);
    }
  };

  const handleBookingLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBookingLink({ ...newBookingLink, url: e.target.value });
  };

  const handleBookingLinkTypeChange = (type: BookingLink['type']) => {
    setNewBookingLink({ ...newBookingLink, type });
  };

  const handleAddBookingLink = () => {
    if (newBookingLink.url.trim() !== '') {
      setEditedProperty(prev => {
        if (!prev) return null;
        const updatedLinks = [...(prev.bookingLinks || []), newBookingLink];
        return { ...prev, bookingLinks: updatedLinks };
      });
      setNewBookingLink({ url: '', type: 'other' });
    }
  };

  const handleRemoveBookingLink = (index: number) => {
    setEditedProperty(prev => {
      if (!prev) return null;
      const updatedLinks = [...(prev.bookingLinks || [])];
      updatedLinks.splice(index, 1);
      return { ...prev, bookingLinks: updatedLinks };
    });
  };

  const getBookingLinkIcon = (type: BookingLink['type']) => {
    switch (type) {
      case 'airbnb':
        return <FaAirbnb className="text-red-500" />;
      case 'booking':
        return <FaBook className="text-blue-500" />;
      default:
        return <FaGlobe className="text-green-500" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" className="py-16">
          <Skeleton variant="rectangular" height={400} className="mb-8" />
          <Skeleton variant="text" height={60} className="mb-4" />
          <Skeleton variant="text" height={40} className="mb-4" />
          <Skeleton variant="rectangular" height={200} />
        </Container>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <Container maxWidth="lg" className="py-16">
          <Typography variant="h4" className="text-center">物件が見つかりません。</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="bg-gray-100 min-h-screen relative">
        <Container maxWidth="lg" className="py-16">
          {/* 編集ボタンを右上に固定 */}
          {isAdmin && (
            <div style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 1000
            }}>
              {isEditing ? (
                <>
                  <Fab
                    color="primary"
                    aria-label="save"
                    onClick={handleSave}
                    style={{ marginRight: '10px' }}
                  >
                    <SaveIcon />
                  </Fab>
                  <Fab
                    color="secondary"
                    aria-label="cancel"
                    onClick={handleCancel}
                  >
                    <CancelIcon />
                  </Fab>
                </>
              ) : (
                <Fab
                  color="primary"
                  aria-label="edit"
                  onClick={handleEdit}
                >
                  <EditIcon />
                </Fab>
              )}
            </div>
          )}

          <Paper elevation={3} className="p-8 mb-8 bg-white shadow-xl">
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                {isEditing ? (
                  <div className="mb-4">
                    <Typography variant="subtitle1" className="mb-2">画像</Typography>
                    {Array.isArray(editedProperty?.imageUrls) && editedProperty.imageUrls.map((url, index) => (
                      <div key={index} className="flex items-center mb-2">
                        {url && (url.startsWith('http://') || url.startsWith('https://')) ? (
                          <Image 
                            src={url}
                            alt={`画像 ${index + 1}`}
                            width={100}
                            height={100}
                            className="mr-2"
                          />
                        ) : (
                          <div className="w-[100px] h-[100px] bg-gray-200 flex items-center justify-center mr-2">
                            <Typography>無効URL</Typography>
                          </div>
                        )}
                        <IconButton onClick={() => handleRemoveImage(index)}>
                          <CancelIcon />
                        </IconButton>
                      </div>
                    ))}
                    <div className="flex items-center mb-2">
                      <TextField
                        fullWidth
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="画像URLを力"
                        className="mr-2"
                      />
                      <Button onClick={handleAddImageUrl} variant="contained">
                        追加
                      </Button>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="mb-2"
                    />
                    {uploadedFile && <Typography>アップロード中: {uploadedFile.name}</Typography>}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {property.imageUrls && property.imageUrls.length > 0 ? (
                      property.imageUrls.map((url, index) => (
                        url && (url.startsWith('http://') || url.startsWith('https://')) ? (
                          <Image 
                            key={index}
                            src={url} 
                            alt={`${property.title} - 画像 ${index + 1}`}
                            width={300}
                            height={200}
                            className="w-full h-auto rounded-lg shadow-lg"
                          />
                        ) : (
                          <div key={index} className="w-full h-[200px] bg-gray-200 flex items-center justify-center rounded-lg shadow-lg">
                            <Typography>無効なURL</Typography>
                          </div>
                        )
                      ))
                    ) : (
                      <Typography>画像がありません</Typography>
                    )}
                  </div>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {isEditing ? (
                  <>
                    <TextField
                      fullWidth
                      name="title"
                      label="タイトル"
                      value={editedProperty?.title || ''}
                      onChange={handleInputChange}
                      className="mb-4"
                    />
                    <TextField
                      fullWidth
                      name="address"
                      label="住所"
                      value={editedProperty?.address || ''}
                      onChange={handleInputChange}
                      className="mb-4"
                    />
                    <TextField
                      fullWidth
                      name="bedrooms"
                      label="寝室数"
                      type="number"
                      value={editedProperty?.bedrooms || ''}
                      onChange={handleInputChange}
                      className="mb-4"
                    />
                    <TextField
                      fullWidth
                      name="bathrooms"
                      label="バスルー数"
                      type="number"
                      value={editedProperty?.bathrooms || ''}
                      onChange={handleInputChange}
                      className="mb-4"
                    />
                    <TextField
                      fullWidth
                      name="area"
                      label="面積 (m)"
                      type="number"
                      value={editedProperty?.area || ''}
                      onChange={handleInputChange}
                      className="mb-4"
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="h3" className="mb-4 font-bold text-gray-800">{property.title}</Typography>
                    <Typography variant="h6" className="mb-4 text-gray-600">{property.address}</Typography>
                    <div className="flex space-x-4 mb-6">
                      {property.bedrooms > 0 && (
                        <div className="flex items-center">
                          <FaBed className="text-indigo-600 mr-2" />
                          <span>{property.bedrooms} 寝室</span>
                        </div>
                      )}
                      {property.bathrooms > 0 && (
                        <div className="flex items-center">
                          <FaBath className="text-indigo-600 mr-2" />
                          <span>{property.bathrooms} バスルーム</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <FaRuler className="text-indigo-600 mr-2" />
                        <span>{property.area} m²</span>
                      </div>
                    </div>
                  </>
                )}
                {isEditing ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="description"
                    label="説明"
                    value={editedProperty?.description || ''}
                    onChange={handleInputChange}
                    className="mb-6"
                  />
                ) : (
                  <Typography variant="body1" className="mb-6 text-gray-700">{property.description}</Typography>
                )}
                {isEditing ? (
                  <TextField
                    fullWidth
                    name="price"
                    label="価格 (1泊あたり)"
                    type="number"
                    value={editedProperty?.price || ''}
                    onChange={handleInputChange}
                    className="mb-4"
                  />
                ) : (
                  <Typography variant="h4" className="mb-4 font-semibold text-indigo-700">
                    {property.price ? `¥${property.price.toLocaleString()} / 泊` : '価格はお問い合わせください'}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
          
          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
              <FaSnowflake className="mr-2 text-indigo-600" /> アメニティ
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                name="amenities"
                label="アメニティ（カンマ区切り）"
                value={Array.isArray(editedProperty?.amenities) ? editedProperty.amenities.join(', ') : ''}
                onChange={(e) => handleArrayInputChange('amenities', e.target.value.split(',').map(item => item.trim()))}
                className="mb-4"
              />
            ) : (
              <Grid container spacing={2}>
                {Array.isArray(property.amenities) ? property.amenities.slice(0, 100).map((amenity, index) => (
                  <Grid item key={index}>
                    <Chip label={amenity} className="bg-indigo-100 text-indigo-700" />
                  </Grid>
                )) : null}
              </Grid>
            )}
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-indigo-600" /> 周辺環境
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                name="surroundings"
                label="周辺環境"
                value={editedProperty?.surroundings || ''}
                onChange={handleInputChange}
                className="mb-4"
              />
            ) : (
              <Typography variant="body1" className="text-gray-700 leading-relaxed">
                {property.surroundings || '周辺環境の詳細は準備中です。'}
              </Typography>
            )}
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-indigo-600" /> 周辺施設
            </Typography>
            {isEditing ? (
              <div>
                <Typography variant="subtitle1" className="mb-2">
                  周辺施設（タイプ,名前,距離km）を入力してください。各施設を新しい行に入力��ます。
                </Typography>
                <TextareaAutosize
                  minRows={6}
                  style={{ width: '100%', padding: '8px', fontFamily: 'inherit' }}
                  value={editedProperty?.nearbyFacilities?.map(f => `${f.type},${f.name},${f.distance || ''}`).join('\n') || ''}
                  onChange={(e) => handleNearbyFacilitiesChange(e.target.value)}
                  placeholder="例:&#10;駅,東京駅,0.5&#10;コビニ,セブンイレブン,0.2&#10;公園,上野公園,1.5"
                />
                <Typography variant="caption" className="mt-2 block text-gray-600">
                  注意: 距離は省略可能です。入力しない場合は空欄のままにしてください。
                </Typography>
              </div>
            ) : (
              <Grid container spacing={2}>
                {Array.isArray(property.nearbyFacilities) && property.nearbyFacilities.length > 0 ? (
                  Object.entries(property.nearbyFacilities.reduce((acc: Record<string, NearbyFacility[]>, facility) => {
                    if (!acc[facility.type]) {
                      acc[facility.type] = [];
                    }
                    acc[facility.type].push(facility);
                    return acc;
                  }, {})).map(([type, facilities]) => (
                    <Grid item xs={12} sm={6} md={4} key={type}>
                      <Paper className="p-4 bg-white shadow-md">
                        <Typography variant="h6" className="mb-2 flex items-center text-indigo-700">
                          {type}
                        </Typography>
                        <ul className="list-disc pl-5 text-gray-700">
                          {facilities.map((f, index) => (
                            <li key={index}>
                              {f.name}{f.distance ? ` (${f.distance}km)` : ''}
                            </li>
                          ))}
                        </ul>
                      </Paper>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography>周辺施設の情報はありせん。</Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
              <FaInfoCircle className="mr-2 text-indigo-600" /> 宿泊詳細
            </Typography>
            <Grid container spacing={3}>
              {isEditing ? (
                <>
 
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      name="maxGuests"
                      label="宿泊人数"
                      type="number"
                      value={editedProperty?.maxGuests || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editedProperty?.smokingAllowed || false}
                          onChange={(e) => handleInputChange({
                            target: { name: 'smokingAllowed', value: e.target.checked }
                          })}
                        />
                      }
                      label="喫煙可"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editedProperty?.petsAllowed || false}
                          onChange={(e) => handleInputChange({
                            target: { name: 'petsAllowed', value: e.target.checked }
                          })}
                        />
                      }
                      label="ペット可"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      name="wifiInfo"
                      label="Wi-Fi情報"
                      value={editedProperty?.wifiInfo || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper className="info-card">
                      <Typography className="info-card-title">
                        <span className="icon-wrapper">
                          <FaUserFriends />
                        </span>
                        最大宿泊人数
                      </Typography>
                      <Typography className="info-card-value">{property.maxGuests}名</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper className="info-card">
                      <Typography className="info-card-title">
                        <span className="icon-wrapper">
                          <FaSmoking />
                        </span>
                        喫煙
                      </Typography>
                      <Typography className="info-card-value">{property.smokingAllowed ? '可' : '不可'}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper className="info-card">
                      <Typography className="info-card-title">
                        <span className="icon-wrapper">
                          <FaPaw />
                        </span>
                        ペット
                      </Typography>
                      <Typography className="info-card-value">{property.petsAllowed ? '可' : '不可'}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper className="info-card">
                      <Typography className="info-card-title">
                        <span className="icon-wrapper">
                          <FaWifi />
                        </span>
                        Wi-Fi
                      </Typography>
                      <Typography className="info-card-value">{property.wifiInfo}</Typography>
                    </Paper>
                  </Grid>

                </>
              )}
            </Grid>
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
              <FaMoneyBillWave className="mr-2 text-indigo-600" /> 料金・ポリシー
            </Typography>
            <Grid container spacing={3}>
              {isEditing ? (
                <>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      name="cleaningFee"
                      label="清掃料金"
                      type="number"
                      value={editedProperty?.cleaningFee || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      name="parking"
                      label="駐車場"
                      value={editedProperty?.parking || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="cancellationPolicy"
                      label="キャンセルポリシー"
                      value={editedProperty?.cancellationPolicy || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper className="p-4 bg-white shadow-md">
                      <Typography variant="subtitle1" className="font-semibold flex items-center">
                        <FaMoneyBillWave className="mr-2 text-indigo-600" /> 清掃料金：
                      </Typography>
                      <Typography>¥{property.cleaningFee?.toLocaleString()}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper className="p-4 bg-white shadow-md">
                      <Typography variant="subtitle1" className="font-semibold flex items-center">
                        <FaParking className="mr-2 text-indigo-600" /> 駐車場：
                      </Typography>
                      <Typography>{property.parking}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper className="p-4 bg-white shadow-md">
                      <Typography variant="subtitle1" className="font-semibold flex items-center">
                        <FaFileContract className="mr-2 text-indigo-600" /> キャンセルポリシ：
                      </Typography>
                      <Typography>{property.cancellationPolicy}</Typography>
                    </Paper>
                  </Grid>
                </>
              )}
            </Grid>
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
              <FaTree className="mr-2 text-indigo-600" /> 周辺情報
            </Typography>
            <Grid container spacing={3}>
              {isEditing ? (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="nearbyAttractions"
                      label="近隣の観光スポット (ンマ区切り)"
                      value={(editedProperty?.nearbyAttractions ?? []).join(', ')}
                      onChange={(e) => handleArrayInputChange('nearbyAttractions', e.target.value.split(',').map(item => item.trim()))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="furnishings"
                      label="主な設備・道具 (カンマ区切り)"
                      value={(editedProperty?.furnishings ?? []).join(', ')}
                      onChange={(e) => handleArrayInputChange('furnishings', e.target.value.split(',').map(item => item.trim()))}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={6}>
                    <Paper className="p-4 bg-white shadow-md">
                      <Typography variant="subtitle1" className="font-semibold flex items-center">
                        <FaMapMarkedAlt className="mr-2 text-indigo-600" /> 近隣の観光スポット：
                      </Typography>
                      <ul className="list-disc pl-5">
                        {property.nearbyAttractions && property.nearbyAttractions.length > 0 ? (
                          property.nearbyAttractions.map((spot, index) => (
                            <li key={index}>{spot}</li>
                          ))
                        ) : (
                          <li>近隣の観光スポット情報はありません</li>
                        )}
                      </ul>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper className="p-4 bg-white shadow-md">
                      <Typography variant="subtitle1" className="font-semibold flex items-center">
                        <FaTools className="mr-2 text-indigo-600" /> 主設備・家具：
                      </Typography>
                      <ul className="list-disc pl-5">
                        {property.furnishings && property.furnishings.length > 0 ? (
                          property.furnishings.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        ) : (
                          <li>主設備・家具報はありません</li>
                        )}
                      </ul>
                    </Paper>
                  </Grid>
                </>
              )}
            </Grid>
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-600" /> 予約能期間
            </Typography>
            {isEditing ? (
              <>
                <TextField
                  type="date"
                  name="availableFrom"
                  label="開始日"
                  value={editedProperty?.availableFrom instanceof Timestamp 
                    ? editedProperty.availableFrom.toDate().toISOString().split('T')[0]
                    : ''}
                  onChange={handleInputChange}
                  className="mr-4"
                />
                <TextField
                  type="date"
                  name="availableTo"
                  label="終了日"
                  value={editedProperty?.availableTo instanceof Timestamp
                    ? editedProperty.availableTo.toDate().toISOString().split('T')[0]
                    : ''}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <Typography>
                {property.availableFrom && property.availableTo
                  ? `${formatDate(property.availableFrom)} から ${formatDate(property.availableTo)} まで`
                  : '予約能期間は定されていません'}
              </Typography>
            )}
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
              <FaCocktail className="mr-2 text-indigo-600" /> 特別オファー
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                name="specialOffers"
                label="特別ファー（1行に1つ"
                value={editedProperty?.specialOffers?.join('\n') || ''}
                onChange={(e) => handleArrayInputChange('specialOffers', e.target.value.split('\n').filter(offer => offer.trim() !== ''))}
              />
            ) : (
              <ul>
                {property.specialOffers?.map((offer, index) => (
                  <li key={index}>{offer}</li>
                )) || <li>現在、特別ファーはありません</li>}
              </ul>
            )}
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-indigo-600" /> 地図
            </Typography>
            {isEditing ? (
              <>
                <TextField
                  fullWidth
                  name="latitude"
                  label="度"
                  type="number"
                  value={editedProperty?.latitude || ''}
                  onChange={handleInputChange}
                  className="mb-4"
                />
                <TextField
                  fullWidth
                  name="longitude"
                  label="経度"
                  type="number"
                  value={editedProperty?.longitude || ''}
                  onChange={handleInputChange}
                  className="mb-4"
                />
              </>
            ) : (
              property.latitude && property.longitude && scriptLoaded ? (
                <MapComponent 
                  lat={property.latitude} 
                  lng={property.longitude} 
                />
              ) : (
                <Typography>地図情報が利用できません</Typography>
              )
            )}
          </section>

          {isEditing && (
            <section className="mb-8">
              <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
                <FaCalendarAlt className="mr-2 text-indigo-600" /> iCal 設定
              </Typography>
              <TextField
                fullWidth
                name="icalUrl"
                label="iCal URL"
                value={editedProperty?.icalUrl || ''}
                onChange={handleInputChange}
                className="mb-4"
              />
            </section>
          )}

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-600" /> 予約カレンダー
            </Typography>
            <Calendar 
              events={calendarEvents}
              currentMonth={currentMonth}
              onMonthChange={handleMonthChange}
              onDateClick={handleDateClick}
              selectedStartDate={selectedStartDate ? new Date(selectedStartDate) : null}
              selectedEndDate={selectedEndDate ? new Date(selectedEndDate) : null}
              unavailableDates={[]}
              maxStayDays={30}
            />
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
              <FaGlobe className="mr-2 text-green-500" /> 予約リンク
            </Typography>
            {isEditing ? (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <TextField
                    fullWidth
                    value={newBookingLink.url}
                    onChange={handleBookingLinkChange}
                    placeholder="予約サイトのURL"
                    className="flex-grow"
                  />
                  <IconButton onClick={() => handleBookingLinkTypeChange('airbnb')} color={newBookingLink.type === 'airbnb' ? 'primary' : 'default'}>
                    <FaAirbnb />
                  </IconButton>
                  <IconButton onClick={() => handleBookingLinkTypeChange('booking')} color={newBookingLink.type === 'booking' ? 'primary' : 'default'}>
                    <FaBook />
                  </IconButton>
                  <IconButton onClick={() => handleBookingLinkTypeChange('other')} color={newBookingLink.type === 'other' ? 'primary' : 'default'}>
                    <FaGlobe />
                  </IconButton>
                  <Button onClick={handleAddBookingLink} variant="contained" startIcon={<AddIcon />}>
                    追加
                  </Button>
                </div>
                <Grid container spacing={2}>
                  {editedProperty?.bookingLinks?.map((link, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          {getBookingLinkIcon(link.type)}
                          <Typography className="ml-2 truncate">{link.url}</Typography>
                        </div>
                        <IconButton onClick={() => handleRemoveBookingLink(index)} color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </div>
            ) : (
              <Grid container spacing={2}>
                {property.bookingLinks?.map((link, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center">
                        {getBookingLinkIcon(link.type)}
                        <Typography className="ml-2 truncate">{link.url}</Typography>
                      </div>
                    </a>
                  </Grid>
                ))}
              </Grid>
            )}
          </section>


          {isAdmin && (
            <section className="mb-8 bg-gray-100 p-6 rounded-lg">
              <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
                <FaLock className="mr-2 text-indigo-600" /> 管理者専用セクション
              </Typography>

              <Paper className="p-4 bg-white shadow-md mb-4">
                <Typography variant="h5" className="mb-2 font-semibold">予約済みゲスト一覧</Typography>
                {bookings.length > 0 ? (
                  <ul>
                    {bookings.map((booking) => (
                      <li key={booking.id} className="mb-2 flex justify-between items-center">
                        <Typography>
                          {booking.guestName} ({booking.guestEmail}) - 
                          {new Date(booking.startDate.seconds * 1000).toLocaleDateString('ja-JP')} から
                          {new Date(booking.endDate.seconds * 1000).toLocaleDateString('ja-JP')} まで
                          （ステータス: {booking.status}）
                        </Typography>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleDeleteBooking(booking.id)}
                          startIcon={<FaTrash />}
                        >
                          削除
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography>予約はありません。</Typography>
                )}
              </Paper>

              <Paper className="p-4 bg-white shadow-md">
                <Typography variant="h5" className="mb-2 font-semibold">iCal フィード</Typography>
                <Typography variant="body1" className="mb-2">
                  以下のURLを使用して、この物件の予約をカレンダーアプリケーションと同期できます：
                </Typography>
                <TextField
                  fullWidth
                  value={icalUrl}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
                <div className="mt-2 flex space-x-2">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FaClipboard />}
                    onClick={() => navigator.clipboard.writeText(icalUrl)}
                  >
                    URLをコピー
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={regenerateToken}
                  >
                    新しいトークンを生成
                  </Button>
                </div>
                <Typography variant="body2" className="mt-4 text-red-600 flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  注意このURLには個人情報が含まれています。取り扱いには十分注意してください。
                </Typography>
              </Paper>
            </section>
          )}


          {showBookingForm && (
            <Paper elevation={3} className="p-8 mb-8 bg-white shadow-xl">
              <Typography variant="h5" className="mb-4">予約情報入力</Typography>
              <TextField
                fullWidth
                label="お名前"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="mb-4"
              />
              <TextField
                fullWidth
                label="メールアドレス"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="mb-4"
              />
              <Typography variant="body1" className="mb-4">
                予約期間：{new Date(selectedStartDate).toLocaleDateString('ja-JP')} から {new Date(selectedEndDate).toLocaleDateString('ja-JP')} まで
              </Typography>
              <Typography variant="body1" className="mb-4">
                合計金額：¥{property.price ? (property.price * (new Date(selectedEndDate).getTime() - new Date(selectedStartDate).getTime()) / (1000 * 60 * 60 * 24)).toLocaleString() : '価格はお問い合わせください'}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleSubmitBooking}>
                予する
              </Button>
            </Paper>
          )}

        </Container>
      </div>
    </Layout>
  );
}