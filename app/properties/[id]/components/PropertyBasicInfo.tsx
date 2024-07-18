import React from 'react';
import { Typography, TextField, Grid } from '@mui/material';
import { FaBed, FaBath, FaRuler } from 'react-icons/fa';

interface PropertyBasicInfoProps {
  property: {
    title: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    description: string;
    price?: number;
  };
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PropertyBasicInfo: React.FC<PropertyBasicInfoProps> = ({
  property,
  isEditing,
  onInputChange
}) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        {isEditing ? (
          <>
            <TextField
              fullWidth
              name="title"
              label="タイトル"
              value={property.title}
              onChange={onInputChange}
              className="mb-4"
            />
            <TextField
              fullWidth
              name="address"
              label="住所"
              value={property.address}
              onChange={onInputChange}
              className="mb-4"
            />
            <TextField
              fullWidth
              name="bedrooms"
              label="寝室数"
              type="number"
              value={property.bedrooms}
              onChange={onInputChange}
              className="mb-4"
            />
            <TextField
              fullWidth
              name="bathrooms"
              label="バスルーム数"
              type="number"
              value={property.bathrooms}
              onChange={onInputChange}
              className="mb-4"
            />
            <TextField
              fullWidth
              name="area"
              label="面積 (m²)"
              type="number"
              value={property.area}
              onChange={onInputChange}
              className="mb-4"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              label="説明"
              value={property.description}
              onChange={onInputChange}
              className="mb-4"
            />
            <TextField
              fullWidth
              name="price"
              label="価格 (1泊あたり)"
              type="number"
              value={property.price || ''}
              onChange={onInputChange}
              className="mb-4"
            />
          </>
        ) : (
          <>
            <Typography variant="h3" className="mb-4 font-bold text-gray-800">{property.title}</Typography>
            <Typography variant="h6" className="mb-4 text-gray-600">{property.address}</Typography>
            <div className="flex space-x-4 mb-6">
              {property.bedrooms > 0 && (
                <div className="flex items-center">
                  <FaBed className="text-indigo-600 mr-2" />
                  <span>{property.bedrooms} 寝室</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center">
                  <FaBath className="text-indigo-600 mr-2" />
                  <span>{property.bathrooms} バスルーム</span>
                </div>
              )}
              <div className="flex items-center">
                <FaRuler className="text-indigo-600 mr-2" />
                <span>{property.area} m²</span>
              </div>
            </div>
            <Typography variant="body1" className="mb-6 text-gray-700">{property.description}</Typography>
            <Typography variant="h4" className="mb-4 font-semibold text-indigo-700">
              {property.price ? `¥${property.price.toLocaleString()} / 泊` : '価格はお問い合わせください'}
            </Typography>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default PropertyBasicInfo;