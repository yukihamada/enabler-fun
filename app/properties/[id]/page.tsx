"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Typography, Paper, Grid, Container, Skeleton, Button, TextField, Chip, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import Image from 'next/image';
import Layout from '../../../components/Layout';
import { FaBed, FaBath, FaRuler, FaWifi, FaSnowflake, FaCar, FaUtensils, FaTshirt, FaSnowman, FaSubway, FaShoppingCart, FaTree, FaSchool, FaCocktail, FaSpa } from 'react-icons/fa';
import { MdEdit as EditIcon, MdSave as SaveIcon, MdCancel as CancelIcon } from 'react-icons/md';

interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  imageUrls: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  surroundings: string;
  price?: number;
  nearbyStations?: string[];
  checkInTime?: string;
  checkOutTime?: string;
  maxGuests?: number;
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
  wifiInfo?: string;
  cleaningFee?: number;
  parking?: string;
  cancellationPolicy?: string;
  nearbyAttractions?: string[];
  furnishings?: string[];
  availableFrom?: Date;
  availableTo?: Date;
  specialOffers?: string[];
  nearbyFacilities?: { name: string; distance: number }[];
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

export default function PropertyDetail() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [editedProperty, setEditedProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
          console.log('物が見つかりません');
        }
      } catch (error) {
        console.error('物件データの取得中にエラーが発生しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    if (property) {
      setEditedProperty({...property});
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

  const handleArrayInputChange = (name: string, value: string[] | { name: string; distance: number }[]) => {
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
      <div className="bg-gray-100 min-h-screen">
        <Container maxWidth="lg" className="py-16">
          <Paper elevation={3} className="p-8 mb-8 bg-white shadow-xl relative">
            <div className="absolute top-4 right-4">
              {isEditing ? (
                <>
                  <IconButton onClick={handleSave} color="primary" className="mr-2">
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={handleCancel} color="secondary">
                    <CancelIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton onClick={handleEdit} color="primary">
                  <EditIcon />
                </IconButton>
              )}
            </div>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="imageUrls"
                    label="画像URL（1行に1つ）"
                    value={editedProperty?.imageUrls?.join('\n') || ''}
                    onChange={(e) => handleArrayInputChange('imageUrls', e.target.value.split('\n').filter(url => url.trim() !== ''))}
                    className="mb-4"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {property.imageUrls && property.imageUrls.length > 0 ? (
                      property.imageUrls.map((url, index) => (
                        <Image 
                          key={index}
                          src={url || '/images/default-property.jpg'} 
                          alt={`${property.title} - 画像 ${index + 1}`}
                          width={300}
                          height={200}
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
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
                      label="バスルーム数"
                      type="number"
                      value={editedProperty?.bathrooms || ''}
                      onChange={handleInputChange}
                      className="mb-4"
                    />
                    <TextField
                      fullWidth
                      name="area"
                      label="面積 (m²)"
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
                      <div className="flex items-center">
                        <FaBed className="text-indigo-600 mr-2" />
                        <span>{property.bedrooms} 寝室</span>
                      </div>
                      <div className="flex items-center">
                        <FaBath className="text-indigo-600 mr-2" />
                        <span>{property.bathrooms} バスルーム</span>
                      </div>
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
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800">高級アメニティ</Typography>
            {isEditing ? (
              <TextField
                fullWidth
                name="amenities"
                label="アメニティ (カンマ区切り)"
                value={(editedProperty?.amenities ?? []).join(', ')}
                onChange={(e) => handleArrayInputChange('amenities', e.target.value.split(',').map(item => item.trim()))}
                className="mb-4"
              />
            ) : (
              <Grid container spacing={2}>
                {property.amenities && property.amenities.map((amenity) => (
                  <Grid item key={amenity}>
                    <Chip label={amenity} className="bg-indigo-100 text-indigo-700" />
                  </Grid>
                ))}
              </Grid>
            )}
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800">周辺環境</Typography>
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
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800">周辺施設</Typography>
            {isEditing ? (
              <>
                <TextField
                  fullWidth
                  name="nearbyStations"
                  label="寄り駅 (カンマ区切り)"
                  value={(editedProperty?.nearbyStations ?? []).join(', ')}
                  onChange={(e) => handleArrayInputChange('nearbyStations', e.target.value.split(',').map(item => item.trim()))}
                  className="mb-4"
                />
                {/* 他の周辺施設（学校、ショッピング、公園）も同様に編集フィールドを追加 */}
              </>
            ) : (
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper className="p-4 bg-white shadow-md">
                    <Typography variant="h6" className="mb-2 flex items-center text-indigo-700">
                      <FaSubway className="mr-2" /> 最寄り駅
                    </Typography>
                    <ul className="list-disc pl-5 text-gray-700">
                      {property.nearbyStations && property.nearbyStations.map((station, index) => (
                        <li key={index}>{station}</li>
                      ))}
                    </ul>
                  </Paper>
                </Grid>
                {/* 他の周辺施設情報（学校、ショッピング、公園）も同様に表示 */}
              </Grid>
            )}
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800">宿泊詳細</Typography>
            <Grid container spacing={3}>
              {isEditing ? (
                <>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      name="checkInTime"
                      label="チェックイン時間"
                      value={editedProperty?.checkInTime || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      name="checkOutTime"
                      label="チェックアウト時間"
                      value={editedProperty?.checkOutTime || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      name="maxGuests"
                      label="最大宿泊人数"
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
                  {property.checkInTime && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle1" className="font-semibold">チェックイン：</Typography>
                      <Typography>{property.checkInTime}</Typography>
                    </Grid>
                  )}
                  {property.checkOutTime && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle1" className="font-semibold">チェックアウト：</Typography>
                      <Typography>{property.checkOutTime}</Typography>
                    </Grid>
                  )}
                  {property.maxGuests && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle1" className="font-semibold">最大宿泊人数：</Typography>
                      <Typography>{property.maxGuests}名</Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle1" className="font-semibold">喫煙：</Typography>
                    <Typography>{property.smokingAllowed ? '可' : '不可'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle1" className="font-semibold">ペット可：</Typography>
                    <Typography>{property.petsAllowed ? '可' : '不可'}</Typography>
                  </Grid>
                  {property.wifiInfo && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle1" className="font-semibold">Wi-Fi：</Typography>
                      <Typography>{property.wifiInfo}</Typography>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800">料金・ポリシー</Typography>
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
                  {property.cleaningFee && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle1" className="font-semibold">清掃料金：</Typography>
                      <Typography>¥{property.cleaningFee.toLocaleString()}</Typography>
                    </Grid>
                  )}
                  {property.parking && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle1" className="font-semibold">駐車場：</Typography>
                      <Typography>{property.parking}</Typography>
                    </Grid>
                  )}
                  {property.cancellationPolicy && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" className="font-semibold">キャンセルポリシー：</Typography>
                      <Typography>{property.cancellationPolicy}</Typography>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800">周辺情報</Typography>
            <Grid container spacing={3}>
              {isEditing ? (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="nearbyAttractions"
                      label="近隣の観光スポット (カンマ区切り)"
                      value={(editedProperty?.nearbyAttractions ?? []).join(', ')}
                      onChange={(e) => handleArrayInputChange('nearbyAttractions', e.target.value.split(',').map(item => item.trim()))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="furnishings"
                      label="主な設備・家具 (カンマ区切り)"
                      value={(editedProperty?.furnishings ?? []).join(', ')}
                      onChange={(e) => handleArrayInputChange('furnishings', e.target.value.split(',').map(item => item.trim()))}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  {property.nearbyAttractions && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" className="font-semibold">近隣の観光スポット：</Typography>
                      <ul className="list-disc pl-5">
                        {property.nearbyAttractions.map((spot, index) => (
                          <li key={index}>{spot}</li>
                        ))}
                      </ul>
                    </Grid>
                  )}
                  {property.furnishings && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" className="font-semibold">主な設備・家具：</Typography>
                      <ul className="list-disc pl-5">
                        {property.furnishings.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800">予約可能期間</Typography>
            {isEditing ? (
              <>
                <TextField
                  type="date"
                  name="availableFrom"
                  label="開始日"
                  value={editedProperty?.availableFrom?.toISOString().split('T')[0] || ''}
                  onChange={handleInputChange}
                  className="mr-4"
                />
                <TextField
                  type="date"
                  name="availableTo"
                  label="終了日"
                  value={editedProperty?.availableTo?.toISOString().split('T')[0] || ''}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <Typography>
                {property.availableFrom && property.availableTo
                  ? `${property.availableFrom.toLocaleDateString()} から ${property.availableTo.toLocaleDateString()} まで`
                  : '予約可能期間は設定されていません'}
              </Typography>
            )}
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800">特別オファー</Typography>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                name="specialOffers"
                label="特別オファー（1行に1つ）"
                value={editedProperty?.specialOffers?.join('\n') || ''}
                onChange={(e) => handleArrayInputChange('specialOffers', e.target.value.split('\n').filter(offer => offer.trim() !== ''))}
              />
            ) : (
              <ul>
                {property.specialOffers?.map((offer, index) => (
                  <li key={index}>{offer}</li>
                )) || <li>現在、特別オファーはありません</li>}
              </ul>
            )}
          </section>

          <section className="mb-8">
            <Typography variant="h4" className="mb-4 font-semibold text-gray-800">近隣の施設</Typography>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                name="nearbyFacilities"
                label="近隣の施設（名前,距離km）"
                value={editedProperty?.nearbyFacilities?.map(f => `${f.name},${f.distance}`).join('\n') || ''}
                onChange={(e) => handleArrayInputChange('nearbyFacilities', e.target.value.split('\n').map(line => {
                  const [name, distance] = line.split(',');
                  return { name, distance: parseFloat(distance) };
                }).filter(f => f.name && !isNaN(f.distance)))}
              />
            ) : (
              <ul>
                {property.nearbyFacilities?.map((facility, index) => (
                  <li key={index}>{facility.name} - {facility.distance}km</li>
                )) || <li>近隣の施設情報はありません</li>}
              </ul>
            )}
          </section>
        </Container>
      </div>
    </Layout>
  );
}