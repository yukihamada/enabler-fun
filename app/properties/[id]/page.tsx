"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { Container, Skeleton, Typography, Fab } from '@mui/material';
import { MdEdit as EditIcon, MdSave as SaveIcon, MdCancel as CancelIcon } from 'react-icons/md';
import Layout from '../../../components/Layout';
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
import { format } from 'date-fns';
import { PropertyContext } from './contexts/PropertyContext';

export default function PropertyDetail() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [editedProperty, setEditedProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user, isLoading: authLoading, error } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [updateProperty] = useState(() => (updatedProperty: Partial<Property>) => {
    setProperty(prev => prev ? { ...prev, ...updatedProperty } : null);
  });
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const onGuestNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setGuestName(event.target.value);
  const onGuestEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setGuestEmail(event.target.value);

  const handleDeleteBooking = async (bookingId: string) => {
    // 予約削除のロジックを実装
  };

  const handleRegenerateToken = async () => {
    // トークン再生成のロジックを実装
  };

  const onSubmit = async (bookingData: BookingData) => {
    // 予約送信のロジックをここに実装
    console.log('予約データ:', bookingData);
  };

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const propertyData = { id: docSnap.id, ...docSnap.data() } as Property;
          setProperty(propertyData);
          setEditedProperty(propertyData);
        } else {
          console.log('物件が見つかりません');
        }
      } catch (error) {
        console.error('物件データの取得中にエラーが発生しました:', error);
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
          const propertyData = { id: docSnap.id, ...docSnap.data() } as Property;
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
          const isSpecificUser = user.email === 'mail@yukihamada.jp';
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
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, updateData);
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
      return { ...prev, [name]: value };
    });
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
        onSubmit
      }}>
        <div className="bg-gray-100 min-h-screen relative">
          <Container maxWidth="lg" className="py-16">
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

            <Typography variant="h1" className="mb-8 text-4xl font-bold">
              {isEditing ? editedProperty?.title ?? '' : property.title}
            </Typography>

            <ImageGallery
              images={isEditing ? editedProperty?.imageUrls ?? [] : property.imageUrls}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />

            <PropertyBasicInfo
              property={{
                address: isEditing ? editedProperty?.address ?? '' : property.address,
                bedrooms: isEditing ? editedProperty?.bedrooms ?? 0 : property.bedrooms,
                bathrooms: isEditing ? editedProperty?.bathrooms ?? 0 : property.bathrooms,
                area: isEditing ? editedProperty?.size ?? 0 : property.size ?? 0,
                description: isEditing ? editedProperty?.description ?? '' : property.description,
                price: isEditing ? editedProperty?.price ?? 0 : property.price
              }}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />

            <AmenitiesSection
              amenities={isEditing ? editedProperty?.amenities ?? [] : property.amenities}
              isEditing={isEditing}
              onInputChange={(name: string, value: string[]) => handleInputChange({ target: { name, value } })}
            />

            <SurroundingsSection
              surroundings={isEditing ? editedProperty?.surroundings || '' : property.surroundings || ''}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />

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

            <PricingPolicySection
              pricing={{
                cleaningFee: isEditing ? editedProperty?.cleaningFee ?? 0 : property.cleaningFee,
                parking: isEditing ? editedProperty?.parking ?? '' : property.parking,
                cancellationPolicy: isEditing ? editedProperty?.cancellationPolicy ?? '' : property.cancellationPolicy
              }}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />

            <SurroundingInfoSection
              info={{
                nearbyAttractions: isEditing ? editedProperty?.nearbyAttractions ?? [] : property.nearbyAttractions,
                furnishings: isEditing ? editedProperty?.furnishings ?? [] : property.furnishings
              }}
              isEditing={isEditing}
              onInputChange={(name, value) => handleInputChange({ target: { name, value } })}
            />

            <AvailabilitySection
              availability={{
                availableFrom: isEditing ? editedProperty?.availableFrom as Timestamp | undefined : property.availableFrom,
                availableTo: isEditing ? editedProperty?.availableTo as Timestamp | undefined : property.availableTo
              }}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              formatDate={(date) => {
                if (date instanceof Date) {
                  return format(date, 'yyyy-MM-dd');
                } else if (typeof date === 'string') {
                  return date;
                } else if (date && typeof date === 'object' && 'toDate' in date) {
                  return format(date.toDate(), 'yyyy-MM-dd');
                }
                return '日時設定';
              }}
            />

            <MapSection
              latitude={isEditing ? editedProperty?.latitude ?? 0 : property.latitude}
              longitude={isEditing ? editedProperty?.longitude ?? 0 : property.longitude}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />

            <BookingLinksSection
              bookingLinks={(isEditing ? editedProperty?.bookingLinks ?? [] : property.bookingLinks) ?? []}
              onInputChange={(e: { target: { name: string; value: any } }) => handleInputChange(e)}
              isEditing={isEditing}
            />

            {isAdmin && (
              <AdminSection
                property={(isEditing ? editedProperty : property)!}
                isAdmin={isAdmin}
                onDeleteBooking={handleDeleteBooking}
                onRegenerateToken={handleRegenerateToken}
              />
            )}

            {showBookingForm && (isEditing ? editedProperty : property) && (
              <BookingForm
                property={isEditing ? editedProperty! : property!}
                onClose={() => setShowBookingForm(false)}
                onSubmit={onSubmit}
              />
            )}
          </Container>
        </div>
      </PropertyContext.Provider>
    </Layout>
  );
}