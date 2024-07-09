'use client'

import { useEffect, useState } from 'react';


import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Layout from '@/components/Layout';
import Link from 'next/link';

interface Property {
  id: string;
  name: string;
  location: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const querySnapshot = await getDocs(collection(db, 'properties'));
      const propertiesList: Property[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Property));
      setProperties(propertiesList);
    };

    fetchProperties();
  }, []);

  return (
    <Layout>
      <main className="bg-white text-gray-900">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-8 text-center">物件一覧</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}>
                  <div className="bg-gray-100 p-6 rounded-lg shadow-md cursor-pointer">
                    <h2 className="text-2xl font-semibold mb-4">{property.name}</h2>
                    <p className="text-lg">{property.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}