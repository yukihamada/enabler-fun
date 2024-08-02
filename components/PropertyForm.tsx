import React from 'react';
import { Property } from '../types/property';

interface PropertyFormProps {
  onSubmit: (e: React.FormEvent) => void;
  newProperty: Partial<Property>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isDarkMode: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onSubmit, newProperty, onInputChange, isDarkMode }) => {
  return (
    <div className={`mt-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>新しい物件を追加</h3>
      <form onSubmit={onSubmit}>
        {/* ... (既存のフォームコード) */}
      </form>
    </div>
  );
};

export default PropertyForm;