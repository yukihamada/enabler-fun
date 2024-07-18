import React from 'react';
import { Typography, TextField, Grid, Paper } from '@mui/material';
import { FaTree, FaMapMarkedAlt, FaTools } from 'react-icons/fa';

interface SurroundingInfoProps {
  info: {
    nearbyAttractions?: string[] | string;
    furnishings?: string[] | string;
  };
  isEditing: boolean;
  onInputChange: (name: string, value: string[]) => void;
}

const SurroundingInfoSection: React.FC<SurroundingInfoProps> = ({
  info,
  isEditing,
  onInputChange
}) => {
  const nearbyAttractionsArray = Array.isArray(info.nearbyAttractions)
    ? info.nearbyAttractions
    : info.nearbyAttractions?.split(',').map(item => item.trim()) || [];

  const furnishingsArray = Array.isArray(info.furnishings)
    ? info.furnishings
    : info.furnishings?.split(',').map(item => item.trim()) || [];

  return (
    <section className="mb-8">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaTree className="mr-2 text-indigo-600" /> 周辺情報
      </Typography>
      <Grid container spacing={3}>
        {isEditing ? (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="nearbyAttractions"
                label="近隣の観光スポット (カンマ区切り)"
                value={(nearbyAttractionsArray ?? []).join(', ')}
                onChange={(e) => onInputChange('nearbyAttractions', e.target.value.split(',').map(item => item.trim()))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="furnishings"
                label="主な設備・道具 (カンマ区切り)"
                value={(furnishingsArray ?? []).join(', ')}
                onChange={(e) => onInputChange('furnishings', e.target.value.split(',').map(item => item.trim()))}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6}>
              <Paper className="p-4 bg-white shadow-md">
                <Typography variant="subtitle1" className="font-semibold flex items-center">
                  <FaMapMarkedAlt className="mr-2 text-indigo-600" /> 近隣の観光スポット
                </Typography>
                <ul className="list-disc pl-5">
                  {nearbyAttractionsArray.length > 0 ? (
                    nearbyAttractionsArray.map((spot, index) => (
                      <li key={index}>{spot}</li>
                    ))
                  ) : (
                    <li>近隣の観光スポット情報はありません</li>
                  )}
                </ul>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className="p-4 bg-white shadow-md">
                <Typography variant="subtitle1" className="font-semibold flex items-center">
                  <FaTools className="mr-2 text-indigo-600" /> 主な設備・家具
                </Typography>
                <ul className="list-disc pl-5">
                  {furnishingsArray.length > 0 ? (
                    furnishingsArray.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    <li>主な設備・家具情報はありません</li>
                  )}
                </ul>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </section>
  );
};

export default SurroundingInfoSection;