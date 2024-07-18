import { Timestamp } from 'firebase/firestore';

export const formatDate = (date: Timestamp | Date | undefined) => {
  if (!date) return '未設定';
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString('ja-JP');
  }
  if (date instanceof Date) {
    return date.toLocaleDateString('ja-JP');
  }
  return '無効な日時';
};

export const renderValue = (value: any): string => {
  if (value === null || value === undefined) return 'データなし';
  if (value instanceof Timestamp) return formatDate(value);
  if (value instanceof Date) return formatDate(value);
  if (Array.isArray(value)) return value.map(renderValue).join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};