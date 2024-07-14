'use client'

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FaBed, FaBath, FaRulerCombined, FaYenSign } from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  imageUrls: string[] | string;
  amenities: string[];
  latitude: number;
  longitude: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 35.6762, // 東京の緯度
  lng: 139.6503 // 東京の経度
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [mapProperties, setMapProperties] = useState<Property[]>([]);
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態を追加

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesCollection = collection(db, 'properties');
        const propertiesSnapshot = await getDocs(propertiesCollection);
        const propertiesList = propertiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Property));
        setProperties(propertiesList);
        setMapProperties(propertiesList.filter(p => p.latitude && p.longitude));
        setIsLoaded(true);

      } catch (error) {
        console.error('物件の取得に失敗しました:', error);
        setIsLoaded(true);
      }
    };

    fetchProperties();
    // ここでログイン状態を確認する処理を追加（例：Firebaseの認証状態を確認）
    // setIsLoggedIn(true); // 仮にログイン状態をtrueに設定

    return () => {
      setIsLoaded(false);
    };
  }, []);

  const handleMarkerClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">物件一覧</h1>
          
          {/* 地図セクション */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">物件マップ</h2>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={10}
              >
                {mapProperties.map((property) => (
                  <Marker
                    key={property.id}
                    position={{ lat: property.latitude!, lng: property.longitude! }}
                    onClick={() => handleMarkerClick(property.id)}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* 物件リストセクション */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>

          {!isLoggedIn && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">会員登録すると、さらに多くの特別な物件をご覧いただけます。</p>
              <Link href="/register" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                会員登録する
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function PropertyCard({ property, isLoggedIn }: { property: Property; isLoggedIn: boolean }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // URLの妥当性をチェックする関数
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // imageUrlsを適切に処理
  const validImageUrls = (Array.isArray(property.imageUrls)
    ? property.imageUrls
    : typeof property.imageUrls === 'string'
    ? property.imageUrls.split(',').map(url => url.trim())
    : []).filter(isValidUrl);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % validImageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + validImageUrls.length) % validImageUrls.length);
  };

  const amenities = Array.isArray(property.amenities)
    ? property.amenities
    : (property.amenities as string)?.split(',').map(item => item.trim()) || [];

  if (property.id === 'member-only' && !isLoggedIn) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-2 text-indigo-600">会員限定物件</h2>
          <p className="text-gray-600 mb-4">この特別な物件は会員の方のみご覧いただけます。</p>
          <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            会員登録して詳細を見る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <Link href={`/properties/${property.id}`}>
        <div className="relative h-48">
          {validImageUrls.length > 0 ? (
            <Image
              src={validImageUrls[currentImageIndex]}
              alt={property.title}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">画像なし</span>
            </div>
          )}
          {validImageUrls.length > 1 && (
            <>
              <button onClick={(e) => { e.preventDefault(); prevImage(); }} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
                ←
              </button>
              <button onClick={(e) => { e.preventDefault(); nextImage(); }} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
                →
              </button>
            </>
          )}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-2 text-indigo-600">{property.title}</h2>
          <p className="text-gray-600 mb-4">{property.address}</p>
          <p className="text-gray-700 mb-4 line-clamp-3">{property.description}</p>
          <div className="flex justify-between items-center text-gray-700 mb-4">
            <span className="text-xl font-bold text-indigo-600 flex items-center">
              <FaYenSign className="mr-1" />
              {property.price?.toLocaleString() ?? '価格未定'} / 泊
            </span>
            <span className="flex items-center">
              <FaBed className="mr-1" /> {property.bedrooms ?? '-'} •
              <FaBath className="mx-1" /> {property.bathrooms ?? '-'} •
              <FaRulerCombined className="mx-1" /> {property.area ?? '-'}m²
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                {amenity}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                +{amenities.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}