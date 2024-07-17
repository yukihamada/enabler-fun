import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export const updatePropertyStatus = async (propertyId: string, newStatus: string) => {
  const propertyRef = doc(db, 'properties', propertyId);
  await updateDoc(propertyRef, { status: newStatus });
};