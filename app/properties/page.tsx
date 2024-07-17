'use client'

import { useEffect, useState, useRef } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FaBed, FaBath, FaRulerCombined, FaYenSign } from 'react-icons/fa';
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
  nearbyFacilities?: Array<{
    type: string;
    name: string;
    distance?: string;
  }>;
  status: string;
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
  const mapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesCollection = collection(db, 'properties');
        const propertiesSnapshot = await getDocs(propertiesCollection);
        const propertiesList = propertiesSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Property))
          .filter(property => property.status === 'published'); // 公開中の物件のみをフィルタリング
        setProperties(propertiesList);
        setMapProperties(propertiesList.filter(p => p.latitude && p.longitude));
      } catch (error) {
        console.error('物件の取得に失敗しました:', error);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || mapProperties.length === 0) return;

      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: 10,
      });

      mapProperties.forEach((property) => {
        const marker = new google.maps.Marker({
          position: { lat: property.latitude, lng: property.longitude },
          map: map,
          title: property.title,
        });

        marker.addListener('click', () => {
          router.push(`/properties/${property.id}`);
        });
      });
    };

    if (typeof window.google === 'undefined') {
      loadGoogleMapsAPI();
    } else {
      initializeMap();
    }
  }, [mapProperties, router]);

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">物件一覧</h1>
          
          {/* 地図セクション */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">物件マップ</h2>
            <div ref={mapRef} style={mapContainerStyle}></div>
          </div>

          {/* 物件リストセクション */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function PropertyCard({ property }: { property: Property }) {
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

  // nearbyFacilitiesの処理を追加
  const nearbyFacilities = Array.isArray(property.nearbyFacilities)
    ? property.nearbyFacilities
    : [];

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

          {nearbyFacilities.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">周辺施設</h3>
              <ul className="list-disc list-inside">
                {nearbyFacilities.map((facility, index) => (
                  <li key={index}>
                    {facility.type}: {facility.name} ({facility.distance || '距離不明'})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}