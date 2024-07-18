import React from 'react';
import { Typography, TextField, Grid, Paper } from '@mui/material';
import { FaCalendarAlt } from 'react-icons/fa';
import { Timestamp } from 'firebase/firestore';

interface AvailabilityProps {
  availability: {
    availableFrom: Timestamp | undefined;
    availableTo: Timestamp | undefined;
  };
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => void;
  formatDate: (date: Timestamp | Date | undefined) => string;
}

const AvailabilitySection: React.FC<AvailabilityProps> = ({
  availability,
  isEditing,
  onInputChange,
  formatDate
}) => {
  return (
    <section className="mb-8">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaCalendarAlt className="mr-2 text-indigo-600" /> 予約可能期間
      </Typography>
      <Grid container spacing={3}>
        {isEditing ? (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="availableFrom"
                label="開始日"
                InputLabelProps={{ shrink: true }}
                value={formatDate(availability.availableFrom)}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="availableTo"
                label="終了日"
                InputLabelProps={{ shrink: true }}
                value={formatDate(availability.availableTo)}
                onChange={onInputChange}
              />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Paper className="p-4 bg-white shadow-md">
              {availability.availableFrom && availability.availableTo ? (
                <Typography>
                  {formatDate(availability.availableFrom)} から {formatDate(availability.availableTo)} まで予約可能
                </Typography>
              ) : (
                <Typography>予約可能期間は設定されていません</Typography>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </section>
  );
};

export default AvailabilitySection;