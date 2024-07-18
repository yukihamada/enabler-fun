import React from 'react';
import { Typography, TextField } from '@mui/material';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface SurroundingsSectionProps {
  surroundings: string;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SurroundingsSection: React.FC<SurroundingsSectionProps> = ({
  surroundings,
  isEditing,
  onInputChange
}) => {
  return (
    <section className="mb-8">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-indigo-600" /> 周辺環境
      </Typography>
      {isEditing ? (
        <TextField
          fullWidth
          multiline
          rows={4}
          name="surroundings"
          label="周辺環境"
          value={surroundings}
          onChange={onInputChange}
          className="mb-4"
        />
      ) : (
        <Typography variant="body1" className="text-gray-700 leading-relaxed">
          {surroundings || '周辺環境の詳細は準備中です。'}
        </Typography>
      )}
    </section>
  );
};

export default SurroundingsSection;