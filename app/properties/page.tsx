'use client'

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  imageUrls: string[];
  amenities: string[];
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);

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
      } catch (error) {
        console.error('物件の取得に失敗しました:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">物件一覧</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
  const imageUrls = property.imageUrls || [];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <Link 
      href={`/properties/${property.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div className="relative h-48">
        {imageUrls.length > 0 ? (
          <Image
            src={imageUrls[currentImageIndex]}
            alt={property.title}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">画像なし</span>
          </div>
        )}
        {imageUrls.length > 1 && (
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
          <span className="text-xl font-bold text-indigo-600">
            ¥{property.price?.toLocaleString() ?? '価格未定'} / 泊
          </span>
          <span>
            {property.bedrooms ?? '-'}寝室 • {property.bathrooms ?? '-'}バス • {property.area ?? '-'}m²
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(property.amenities ?? []).slice(0, 3).map((amenity, index) => (
            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
              {amenity}
            </span>
          ))}
          {(property.amenities?.length ?? 0) > 3 && (
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
              +{(property.amenities?.length ?? 0) - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}