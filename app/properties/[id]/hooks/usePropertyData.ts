import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { Property } from '../types';

export const usePropertyData = (id: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const propertyData = { id: docSnap.id, ...docSnap.data() } as Property;
          // データの整形ロジックをここに移動
          setProperty(propertyData);
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
  }, [id]);

  return { property, loading };
};