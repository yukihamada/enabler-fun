import React from 'react';
import { Typography, TextField, Grid, Chip } from '@mui/material';
import { FaSnowflake } from 'react-icons/fa';

interface AmenitiesSectionProps {
  amenities: string[] | string;
  isEditing: boolean;
  onInputChange: (name: string, value: string[]) => void;
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  amenities,
  isEditing,
  onInputChange
}) => {
  const amenitiesArray = typeof amenities === 'string' ? amenities.split(',').map(item => item.trim()) : amenities;

  return (
    <section className="mb-8">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaSnowflake className="mr-2 text-indigo-600" /> アメニティ
      </Typography>
      {isEditing ? (
        <TextField
          fullWidth
          name="amenities"
          label="アメニティ（カンマ区切り）"
          value={amenitiesArray.join(', ')}
          onChange={(e) => onInputChange('amenities', e.target.value.split(',').map(item => item.trim()))}
          className="mb-4"
        />
      ) : (
        <Grid container spacing={2}>
          {amenitiesArray.slice(0, 100).map((amenity, index) => (
            <Grid item key={index}>
              <Chip label={amenity} className="bg-indigo-100 text-indigo-700" />
            </Grid>
          ))}
        </Grid>
      )}
    </section>
  );
};

export default AmenitiesSection;