import React from 'react';
import { Typography, TextField, Button, Paper } from '@mui/material';
import { useProperty } from '../contexts/PropertyContext';
import { Property, BookingData } from '../types';

interface BookingFormProps {
  property: Property;
  onClose: () => void;
  onSubmit: (bookingData: BookingData) => Promise<void>;
}

const BookingForm: React.FC<BookingFormProps> = ({
  property,
  onClose,
  onSubmit
}) => {
  const propertyContext = useProperty();
  if (!propertyContext) return null;

  const { selectedStartDate, selectedEndDate, guestName, guestEmail, onGuestNameChange, onGuestEmailChange } = propertyContext;

  if (!property || !selectedStartDate || !selectedEndDate) return null;

  const totalNights = Math.ceil((new Date(selectedEndDate).getTime() - new Date(selectedStartDate).getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = property.price * totalNights;

  const handleSubmit = () => {
    const bookingData: BookingData = {
      guestName,
      guestEmail,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      totalPrice
    };
    onSubmit(bookingData);
  };

  return (
    <Paper elevation={3} className="p-8 mb-8 bg-white shadow-xl">
      <Typography variant="h5" className="mb-4">予約情報入力</Typography>
      <TextField
        fullWidth
        label="お名前"
        value={guestName}
        onChange={onGuestNameChange}
        className="mb-4"
      />
      <TextField
        fullWidth
        label="メールアドレス"
        type="email"
        value={guestEmail}
        onChange={onGuestEmailChange}
        className="mb-4"
      />
      <Typography variant="body1" className="mb-4">
        予約期間：{new Date(selectedStartDate).toLocaleDateString('ja-JP')} から {new Date(selectedEndDate).toLocaleDateString('ja-JP')} まで
      </Typography>
      <Typography variant="body1" className="mb-4">
        合計金額：¥{totalPrice.toLocaleString()}（¥{property.price.toLocaleString()} × {totalNights}泊）
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        予約する
      </Button>
    </Paper>
  );
};

export default BookingForm;