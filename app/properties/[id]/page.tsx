"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { Container, Skeleton, Typography, Fab } from '@mui/material';
import { MdEdit as EditIcon, MdSave as SaveIcon, MdCancel as CancelIcon } from 'react-icons/md';
import { db } from '../../../lib/firebase';
import { useUser } from '@auth0/nextjs-auth0/client';
import ImageGallery from './components/ImageGallery';
import PropertyBasicInfo from './components/PropertyBasicInfo';
import AmenitiesSection from './components/AmenitiesSection';
import SurroundingsSection from './components/SurroundingsSection';
import AccommodationDetailsSection from './components/AccommodationDetailsSection';
import PricingPolicySection from './components/PricingPolicySection';
import SurroundingInfoSection from './components/SurroundingInfoSection';
import AvailabilitySection from './components/AvailabilitySection';
import MapSection from './components/MapSection';
import BookingLinksSection from './components/BookingLinksSection';
import AdminSection from './components/AdminSection';
import BookingForm from './components/BookingForm';
import { Property, BookingData } from './types';
import { format, parseISO } from 'date-fns';
import { createContext } from 'react';
import { PropertyContext } from './contexts/PropertyContext';
import { Review as PropertyReview } from './types';
import ReviewSection from './components/ReviewSection';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../lib/firebase';
import crypto from 'crypto';
import HostInfoSection from './components/HostInfoSection';
import DatePicker from "react-datepicker";
import { ja } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

// インターフェースを修正
interface ICalImport {
  url: string;
  name?: string; // nameをオプショナルにする
}

interface AttachedFile {
  url: string;
  name: string;
}

type PropertyWithAttachedFiles = Property & { attachedFiles?: AttachedFile[]; area: number; };

export default function PropertyDetail() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<PropertyWithAttachedFiles | null>(null);
  const [loading, setLoading] = useState(true);
  const [editedProperty, setEditedProperty] = useState<PropertyWithAttachedFiles | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user, isLoading: authLoading, error } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [updateProperty] = useState(() => (updatedProperty: Partial<PropertyWithAttachedFiles>) => {
    setProperty(prev => prev ? { ...prev, ...updatedProperty } : null);
  });
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const [iCalImports, setICalImports] = useState<ICalImport[]>([]);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const changeLanguage = (lang: string) => {
    // 言語切り替えのロジックを実装
    console.log(`言語を${lang}に切り替え`);
  };

  useEffect(() => {
    if (property?.icalUrls) {
      setICalImports(property.icalUrls.map(url => ({ url })));
    }
  }, [property?.icalUrls]);

  const addICalImport = useCallback((newImport: ICalImport) => {
    setICalImports(prev => [...prev, newImport]);
    setEditedProperty(prev => {
      if (!prev) return null;
      return { ...prev, icalUrls: [...(prev.icalUrls || []), newImport.url] };
    });
  }, []);

  const removeICalImport = useCallback((index: number) => {
    setICalImports(prev => {
      const newImports = [...prev];
      newImports.splice(index, 1);
      return newImports;
    });
    setEditedProperty(prev => {
      if (!prev) return null;
      const newIcalUrls = [...(prev.icalUrls || [])];
      newIcalUrls.splice(index, 1);
      return { ...prev, icalUrls: newIcalUrls };
    });
  }, []);

  const onGuestNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setGuestName(event.target.value);
  const onGuestEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setGuestEmail(event.target.value);

  const handleDeleteBooking = async (bookingId: string) => {
    // 予約削除のロジッを実装
  };

  const handleRegenerateToken = async () => {
    // トークン再生成のロジックを実装
  };

  const onSubmit = async (bookingData: BookingData) => {
    // 送信ロジックをここに実装
    console.log('予約データ:', bookingData);
  };

  const hashFileName = (fileName: string): string => {
    const hash = crypto.createHash('md5').update(fileName).digest('hex');
    const extension = fileName.split('.').pop();
    return `${hash}.${extension}`;
  };

  const handleImageUpload = useCallback(async (file: File) => {
    const hashedFileName = hashFileName(file.name);
    const storageRef = ref(storage, `image/${hashedFileName}`);
    try {
      await uploadBytes(storageRef, file);
      console.log('画像Storageにアップロードされました');
      const downloadURL = await getDownloadURL(storageRef);
      console.log('ダウンロードURLを取しました:', downloadURL);
      
      setEditedProperty(prev => {
        if (!prev) return null;
        const newImageUrls = [...prev.imageUrls, downloadURL];
        console.log('新しいimageUrls:', newImageUrls);
        return {
          ...prev,
          imageUrls: newImageUrls
        };
      });
      
      console.log('編中のプロパティの状を更新しました');
    } catch (error) {
      console.error('ファイルのアップロードに失敗しました:', error);
    }
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const propertyData = { id: docSnap.id, ...docSnap.data() } as PropertyWithAttachedFiles;
          setProperty(propertyData);
          setEditedProperty(propertyData);
        } else {
          console.log('物件が見つかりません');
        }
      } catch (error) {
        console.error('物件ータの取得中にエラーが発生しまた:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();

    let unsubscribe: () => void;
    if (isEditing && id) {
      const docRef = doc(db, 'properties', id);
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const propertyData = { id: docSnap.id, ...docSnap.data() } as PropertyWithAttachedFiles;
          setEditedProperty(propertyData);
        }
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [id, isEditing]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const response = await fetch('/api/auth/me');
          const userData = await response.json();
          const userRoles = userData['https://auth.enabler.fun/roles'] as string[] | undefined;
          const isAdminUser = Array.isArray(userRoles) && userRoles.includes('admin');
          const isSpecificUser = user.email === 'yuki@hamada.tokyo';
          setIsAdmin(isAdminUser || isSpecificUser);
        } catch (error) {
          console.error('管理者状態の確認中にエラーが発生しました:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [user, authLoading]);

  const handleEdit = () => {
    setIsEditing(true);
    if (property) {
      setEditedProperty({ ...property });
    }
  };

  const handleSave = async () => {
    if (!editedProperty) return;
    try {
      const { id, ...updateData } = editedProperty;
      // icalUrlsを明示的に含める
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, {
        ...updateData,
        icalUrls: iCalImports.map(imp => imp.url)
      });
      setProperty(editedProperty);
      setIsEditing(false);
    } catch (error) {
      console.error('物件の更新中にエラーが発生しました:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProperty(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setEditedProperty(prev => {
      if (!prev) return null;
      if (name.startsWith('imageUrls[')) {
        const index = parseInt(name.match(/\d+/)![0], 10);
        const newImageUrls = [...prev.imageUrls];
        newImageUrls[index] = value;
        return { ...prev, imageUrls: newImageUrls };
      }
      if (name.startsWith('host.')) {
        const hostField = name.split('.')[1];
        return { ...prev, host: { ...prev.host, [hostField]: value } };
      }
      return { ...prev, [name]: value };
    });
  };

  const convertToImageArray = (imageUrls: string | string[] | undefined): { url: string }[] => {
    if (!imageUrls) return [];
    if (Array.isArray(imageUrls)) return imageUrls.map(url => ({ url }));
    return imageUrls.split(',').map(url => ({ url: url.trim() }));
  };

  if (loading) {
    return (
      <>
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          changeLanguage={changeLanguage}
        />
        <Container maxWidth="lg" className="py-16">
          <Skeleton variant="rectangular" height={400} className="mb-8" />
          <Skeleton variant="text" height={60} className="mb-4" />
          <Skeleton variant="text" height={40} className="mb-4" />
          <Skeleton variant="rectangular" height={200} />
        </Container>
        <Footer isDarkMode={isDarkMode} />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          changeLanguage={changeLanguage}
        />
        <Container maxWidth="lg" className="py-16">
          <Typography variant="h4" className="text-center">物件が見つかりません。</Typography>
        </Container>
        <Footer isDarkMode={isDarkMode} />
      </>
    );
  }

  return (
    <>
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        changeLanguage={changeLanguage}
      />
      <PropertyContext.Provider value={{
        property: isEditing ? editedProperty : property,
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
        guestEmail,
        setGuestEmail,
        onGuestNameChange,
        onGuestEmailChange,
        onSubmit,
        iCalImports,
        addICalImport,
        removeICalImport
      }}>
        <div className="bg-gray-100 min-h-screen relative">
          <Container maxWidth="lg" className="py-16">
            {/* 1. ッダー（ナビゲーション）Layoutコンポーネントに含まている仮定 */}

            {/* 2. メインジュアル */}
            <ImageGallery
              images={convertToImageArray(isEditing ? editedProperty?.imageUrls : property.imageUrls)}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onImageUpload={handleImageUpload}
              onImageDelete={(index) => {
                setEditedProperty(prev => {
                  if (!prev) return null;
                  const newImageUrls = [...prev.imageUrls];
                  newImageUrls.splice(index, 1);
                  return { ...prev, imageUrls: newImageUrls };
                });
              }}
              onImagesReorder={(newImages: { url: string; caption?: string }[]) => {
                setEditedProperty(prev => {
                  if (!prev) return null;
                  return { ...prev, imageUrls: newImages.map(img => img.url) };
                });
              }}
            />

            {/* 3. 基本情報とクイック予約 */}
            <Typography variant="h1" className="mb-8 text-xl font-bold">
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={editedProperty?.title ?? ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-xl font-bold"
                />
              ) : (
                property.title
              )}
            </Typography>
            <PropertyBasicInfo
              property={{
                address: isEditing ? editedProperty?.address ?? '' : property.address,
                bedrooms: isEditing ? editedProperty?.bedrooms ?? 0 : property.bedrooms,
                bathrooms: isEditing ? editedProperty?.bathrooms ?? 0 : property.bathrooms,
                area: isEditing ? editedProperty?.area ?? 0 : property.area ?? 0,
                description: isEditing ? editedProperty?.description ?? '' : property.description,
                price: isEditing ? editedProperty?.price ?? 0 : property.price,
                icalUrls: isEditing ? editedProperty?.icalUrls ?? [] : property.icalUrls ?? [],
                closedDays: isEditing ? editedProperty?.closedDays ?? [] : property.closedDays ?? [],
                cleaningTime: isEditing ? editedProperty?.cleaningTime ?? '' : property.cleaningTime ?? '',
              }}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onIcalUrlsChange={(newIcalUrls) => {
                setEditedProperty(prev => prev ? { ...prev, icalUrls: newIcalUrls } : null);
              }}
              isMember={user?.membership === 'member'}
            />
            {/* クイッ予約ボタンを追加 */}

            {/* 4. 物件の特徴と詳細説明 */}
            {/* 新しいインポーネントを作成して詳細説をす */}

            {/* 5. アメニティ・設備 */}
            <AmenitiesSection
              amenities={isEditing ? editedProperty?.amenities ?? [] : property.amenities}
              isEditing={isEditing}
              onInputChange={(name: string, value: string[]) => handleInputChange({ target: { name, value } })}
            />

            {/* 6. 写真ギャラリー（既に上部にあるので省略可能） */}

            {/* 7. 料金情報 */}
            <PricingPolicySection
              pricing={{
                cleaningFee: isEditing ? editedProperty?.cleaningFee ?? 0 : property.cleaningFee,
                parking: isEditing ? editedProperty?.parking ?? '' : property.parking,
                cancellationPolicy: isEditing ? editedProperty?.cancellationPolicy ?? '' : property.cancellationPolicy
              }}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />

            {/* 8. カレンダーと予約フォーム */}
            <AvailabilitySection
              availability={{
                availableFrom: isEditing ? editedProperty?.availableFrom as Timestamp | undefined : property.availableFrom,
                availableTo: isEditing ? editedProperty?.availableTo as Timestamp | undefined : property.availableTo
              }}
              pricePerNight={isEditing ? editedProperty?.price ?? 0 : property.price}
              isEditing={isEditing}
              formatDate={(date) => {
                if (date instanceof Date) {
                  return format(date, 'yyyy年MM月dd日', { locale: ja });
                } else if (typeof date === 'string') {
                  return date;
                } else if (date && typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
                  return format((date as { toDate(): Date }).toDate(), 'yyyy年MM月dd日', { locale: ja });
                }
                return '日付未設定';
              }}
              icalUrls={isEditing ? editedProperty?.icalUrls : property.icalUrls}
              availableDates={(isEditing ? editedProperty?.availableDates : property.availableDates)?.map(date => new Date(date)) ?? []}
              selectedStartDate={selectedStartDate}
              setSelectedStartDate={setSelectedStartDate}
              selectedEndDate={selectedEndDate}
              setSelectedEndDate={setSelectedEndDate}
              onReserve={() => setShowBookingForm(true)}
              isLoggedIn={!!user}
            >
              <DatePicker
                selected={selectedStartDate}
                onChange={(date: Date | null) => setSelectedStartDate(date)}
                locale={ja}
                dateFormat="yyyy年MM月dd日"
                className="custom-datepicker"
              />
            </AvailabilitySection>
            {/* 予約フォームを表示 */}
            {showBookingForm && (
              <BookingForm
                property={isEditing ? editedProperty! : property!}
                onClose={() => setShowBookingForm(false)}
                onSubmit={onSubmit}
              />
            )}

            {/* 9. ロケーョン報と地図 */}
            <MapSection
              latitude={isEditing ? editedProperty?.latitude ?? 0 : property.latitude}
              longitude={isEditing ? editedProperty?.longitude ?? 0 : property.longitude}
              isEditing={isEditing}
              onInputChange={(name: string, value: any) => handleInputChange({ target: { name, value } })}
            />
            <SurroundingInfoSection
              info={{
                nearbyAttractions: isEditing ? editedProperty?.nearbyAttractions ?? [] : property.nearbyAttractions,
                furnishings: isEditing ? editedProperty?.furnishings ?? [] : property.furnishings
              }}
              isEditing={isEditing}
              onInputChange={(name: string, value: any) => handleInputChange({ target: { name, value } })}
            />

            {/* 10. レビュ・評価 */}
            <ReviewSection
              reviews={(isEditing ? editedProperty?.reviews : property.reviews)?.map(review => ({
                ...review,
                date: review.date instanceof Timestamp ? review.date.toDate().toISOString() : review.date
              })) ?? []}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />

            {/* 12. ハウスルール */}
            <AccommodationDetailsSection
              details={{
                maxGuests: isEditing ? editedProperty?.maxGuests ?? 0 : property.maxGuests,
                smokingAllowed: isEditing ? editedProperty?.smokingAllowed ?? false : property.smokingAllowed,
                petsAllowed: isEditing ? editedProperty?.petsAllowed ?? false : property.petsAllowed,
                wifiInfo: isEditing ? editedProperty?.wifiInfo ?? '' : property.wifiInfo
              }}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />

            {/* 13. よくある質問（FAQ）（しいコンポーネントを作成） */}

            {/* 14. フッター（Layoutコンポーネントに含まれていると仮定） */}

            {/* BookingLinksSection を追加 */}
            <BookingLinksSection
              bookingLinks={isEditing ? editedProperty?.bookingLinks ?? [] : property.bookingLinks ?? []}
              onInputChange={handleInputChange}
              isEditing={isEditing}
            />

            {/* 管理者用編集タ */}
            {isAdmin && (
              <div className="fixed bottom-4 right-4">
                {isEditing ? (
                  <>
                    <Fab color="primary" aria-label="save" onClick={handleSave} className="mr-2">
                      <SaveIcon />
                    </Fab>
                    <Fab color="secondary" aria-label="cancel" onClick={handleCancel}>
                      <CancelIcon />
                    </Fab>
                  </>
                ) : (
                  <Fab color="primary" aria-label="edit" onClick={handleEdit}>
                    <EditIcon />
                  </Fab>
                )}
              </div>
            )}

            {/* 管理者用セクション */}
            {isAdmin && (
              <AdminSection
                property={(isEditing ? editedProperty : property)!}
                isAdmin={isAdmin}
                onDeleteBooking={handleDeleteBooking}
                onRegenerateToken={handleRegenerateToken}
                closedDays={isEditing ? editedProperty?.closedDays ?? [] : property.closedDays ?? []}
                cleaningTime={isEditing ? editedProperty?.cleaningTime ?? '' : property.cleaningTime ?? ''}
                onInputChange={handleInputChange}
                wifiSSID={isEditing ? editedProperty?.wifiSSID ?? '' : property.wifiSSID ?? ''}
                wifiPassword={isEditing ? editedProperty?.wifiPassword ?? '' : property.wifiPassword ?? ''}
                attachedFiles={isEditing ? editedProperty?.attachedFiles ?? [] : property.attachedFiles ?? []}
                onFileUpload={async (file) => {
                  /* ファイルアップロードの処理 */
                  // 例: await uploadFile(file);
                }}
                onFileDelete={async (fileId) => {
                  /* ファイル削除の処理 */
                  // 例: await deleteFile(fileId);
                }}
              />
            )}
          </Container>
        </div>
      </PropertyContext.Provider>
      <Footer isDarkMode={isDarkMode} />
    </>
  );
}