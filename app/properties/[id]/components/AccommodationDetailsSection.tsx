import React from 'react';
import { Typography, TextField, Grid, Paper, FormControlLabel, Checkbox } from '@mui/material';
import { FaInfoCircle, FaUserFriends, FaSmoking, FaPaw, FaWifi } from 'react-icons/fa';

interface AccommodationDetailsSectionProps {
  details: {
    maxGuests?: number;
    smokingAllowed?: boolean;
    petsAllowed?: boolean;
    wifiInfo?: string;
  };
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: any } }) => void;
}

const AccommodationDetailsSection: React.FC<AccommodationDetailsSectionProps> = ({
  details,
  isEditing,
  onInputChange
}) => {
  return (
    <section className="mb-8">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaInfoCircle className="mr-2 text-indigo-600" /> 宿泊詳細
      </Typography>
      <Grid container spacing={3}>
        {isEditing ? (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                name="maxGuests"
                label="宿泊人数"
                type="number"
                value={details.maxGuests || ''}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={details.smokingAllowed || false}
                    onChange={(e) => onInputChange({
                      target: { name: 'smokingAllowed', value: e.target.checked }
                    })}
                  />
                }
                label="喫煙可"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={details.petsAllowed || false}
                    onChange={(e) => onInputChange({
                      target: { name: 'petsAllowed', value: e.target.checked }
                    })}
                  />
                }
                label="ペット可"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                name="wifiInfo"
                label="Wi-Fi情報"
                value={details.wifiInfo || ''}
                onChange={onInputChange}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <Paper className="info-card">
                <Typography className="info-card-title">
                  <span className="icon-wrapper">
                    <FaUserFriends />
                  </span>
                  最大宿泊人数
                </Typography>
                <Typography className="info-card-value">{details.maxGuests}名</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper className="info-card">
                <Typography className="info-card-title">
                  <span className="icon-wrapper">
                    <FaSmoking />
                  </span>
                  喫煙
                </Typography>
                <Typography className="info-card-value">{details.smokingAllowed ? '可' : '不可'}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper className="info-card">
                <Typography className="info-card-title">
                  <span className="icon-wrapper">
                    <FaPaw />
                  </span>
                  ペット
                </Typography>
                <Typography className="info-card-value">{details.petsAllowed ? '可' : '不可'}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper className="info-card">
                <Typography className="info-card-title">
                  <span className="icon-wrapper">
                    <FaWifi />
                  </span>
                  Wi-Fi
                </Typography>
                <Typography className="info-card-value">{details.wifiInfo}</Typography>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </section>
  );
};

export default AccommodationDetailsSection;