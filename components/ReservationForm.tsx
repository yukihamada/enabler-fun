import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';

interface ReservationFormProps {
  selectedDate: Date | null;
  onSubmit: (reservationData: any) => void;
  onCancel: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ selectedDate, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date: selectedDate,
      name,
      email,
    });
  };

  return (
    <div className="mt-4 p-4 border rounded">
      <Typography variant="h6" className="mb-4">予約フォーム</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mb-4"
        />
        <TextField
          fullWidth
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4"
        />
        <Typography variant="body1" className="mb-4">
          選択された日付: {selectedDate?.toLocaleDateString()}
        </Typography>
        <div className="flex justify-end">
          <Button type="button" onClick={onCancel} className="mr-2">
            キャンセル
          </Button>
          <Button type="submit" variant="contained" color="primary">
            予約する
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;