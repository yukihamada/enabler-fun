import React from 'react';
import { Typography, TextField } from '@mui/material';
import { FaCocktail } from 'react-icons/fa';

interface SpecialOffersSectionProps {
  specialOffers: string[] | undefined;
  isEditing: boolean;
  onInputChange: (name: string, value: string[]) => void;
}

const SpecialOffersSection: React.FC<SpecialOffersSectionProps> = ({
  specialOffers,
  isEditing,
  onInputChange,
}) => {
  return (
    <section className="mb-8">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaCocktail className="mr-2 text-indigo-600" /> 特別オファー
      </Typography>
      {isEditing ? (
        <TextField
          fullWidth
          multiline
          rows={4}
          name="specialOffers"
          label="特別オファー（1行に1つ）"
          value={specialOffers?.join('\n') || ''}
          onChange={(e) => onInputChange('specialOffers', e.target.value.split('\n').filter(offer => offer.trim() !== ''))}
        />
      ) : (
        <ul>
          {specialOffers?.map((offer, index) => (
            <li key={index}>{offer}</li>
          )) || <li>現在、特別オファーはありません</li>}
        </ul>
      )}
    </section>
  );
};

export default SpecialOffersSection;