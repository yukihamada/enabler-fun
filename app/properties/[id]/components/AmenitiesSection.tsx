import React from 'react';
import { Typography, TextField, Grid, Chip, Autocomplete, Box, Paper } from '@mui/material';
import { FaSnowflake, FaWifi, FaParking, FaUtensils, FaTv } from 'react-icons/fa';
import { MdAcUnit, MdLocalLaundryService, MdKitchen, MdBathtub } from 'react-icons/md';

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

  const commonAmenities = [
    { label: 'Wi-Fi', icon: <FaWifi /> },
    { label: 'エアコン', icon: <MdAcUnit /> },
    { label: '駐車場', icon: <FaParking /> },
    { label: 'キッチン', icon: <FaUtensils /> },
    { label: '洗濯機', icon: <MdLocalLaundryService /> },
    { label: '冷蔵庫', icon: <MdKitchen /> },
    { label: 'テレビ', icon: <FaTv /> },
    { label: 'バスタブ', icon: <MdBathtub /> },
  ];

  return (
    <Paper elevation={3} className="mt-8 mb-8 p-6 rounded-lg">
      <Typography variant="h4" className="mb-6 font-semibold text-gray-800 flex items-center">
        <FaSnowflake className="mr-3 text-indigo-600" /> アメニティ
      </Typography>
      {isEditing ? (
        <Autocomplete
          multiple
          freeSolo
          options={commonAmenities.map(option => option.label)}
          value={amenitiesArray}
          onChange={(_, newValue) => onInputChange('amenities', newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              name="amenities"
              label="アメニティ"
              placeholder="新しいアメニティを追加"
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="filled"
                label={option}
                {...getTagProps({ index })}
                className="bg-indigo-100 text-indigo-700 font-medium"
              />
            ))
          }
          className="mb-6"
        />
      ) : (
        <Box className="flex flex-wrap gap-2">
          {amenitiesArray.slice(0, 100).map((amenity, index) => {
            const matchedAmenity = commonAmenities.find(item => item.label === amenity);
            return (
              <Chip
                key={index}
                icon={matchedAmenity?.icon}
                label={amenity}
                className="bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 transition-colors duration-200"
              />
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default AmenitiesSection;