import React from 'react';
import { Typography, Grid, Paper, Box, Link } from '@mui/material';
import { MdBed, MdBathtub, MdSquareFoot, MdLocationOn } from 'react-icons/md';

interface PropertyBasicInfoProps {
  property: {
    address: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    description: string;
    price: number;
    icalUrls: string[];
    closedDays: string[];
    cleaningTime: string;
  };
  isEditing: boolean;
  isMember: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => void;
  onIcalUrlsChange: (newIcalUrls: string[]) => void;
}

const PropertyBasicInfo: React.FC<PropertyBasicInfoProps> = ({
  property,
  isEditing,
  isMember,
  onInputChange,
}) => {
  const renderAddress = () => {
    if (isEditing) {
      return (
        <input
          type="text"
          name="address"
          value={property.address}
          onChange={onInputChange}
          className="w-full p-1 border rounded"
        />
      );
    } else if (isMember) {
      return property.address;
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          <Box sx={{ mr: 1 }}><MdLocationOn /></Box>
          <Typography variant="body2">
            詳細な住所は
            <Link href="/signup" color="primary" sx={{ mx: 0.5 }}>
              会員登録
            </Link>
            後、予約時に表示されます
          </Typography>
        </Box>
      );
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: '#f5f5f5' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
        基本情報
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            {renderAddress()}
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MdBed style={{ marginRight: '8px', color: '#1976d2' }} />
            <Typography variant="body1">
              寝室: {isEditing ? (
                <input
                  type="number"
                  name="bedrooms"
                  value={property.bedrooms}
                  onChange={onInputChange}
                  className="w-16 p-1 border rounded"
                />
              ) : property.bedrooms}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MdBathtub style={{ marginRight: '8px', color: '#1976d2' }} />
            <Typography variant="body1">
              バスルーム: {isEditing ? (
                <input
                  type="number"
                  name="bathrooms"
                  value={property.bathrooms}
                  onChange={onInputChange}
                  className="w-16 p-1 border rounded"
                />
              ) : property.bathrooms}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 1, color: '#1976d2' }}>
              <MdSquareFoot />
            </Box>
            <Typography variant="body1">
              面積: {isEditing ? (
                <input
                  type="number"
                  name="area"
                  value={property.area}
                  onChange={onInputChange}
                  className="w-16 p-1 border rounded"
                />
              ) : property.area} m²
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>料金</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1">
              1泊あたり: {isEditing ? (
                <input
                  type="number"
                  name="price"
                  value={property.price}
                  onChange={onInputChange}
                  className="w-24 p-1 border rounded"
                />
              ) : property.price} 円
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>説明</Typography>
          {isEditing ? (
            <textarea
              name="description"
              value={property.description}
              onChange={onInputChange}
              className="w-full p-2 border rounded"
              rows={4}
            />
          ) : (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {property.description}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PropertyBasicInfo;