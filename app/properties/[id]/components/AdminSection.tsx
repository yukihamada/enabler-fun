import React from 'react';
import { Typography, Paper, Button, TextField } from '@mui/material';
import { FaLock, FaTrash, FaClipboard, FaExclamationTriangle } from 'react-icons/fa';
import { useProperty } from '../contexts/PropertyContext';
import { Property, Booking } from '../types';

interface AdminSectionProps {
  property: Property;
  isAdmin: boolean;
  onDeleteBooking: (bookingId: string) => void;
  onRegenerateToken: () => void;
}

const AdminSection: React.FC<AdminSectionProps> = ({
  property,
  isAdmin,
  onDeleteBooking,
  onRegenerateToken
}) => {
  const { isEditing } = useProperty() ?? {};

  if (!isEditing) return null;

  return (
    <section className="mb-8 bg-gray-100 p-6 rounded-lg">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaLock className="mr-2 text-indigo-600" /> 管理者専用セクション
      </Typography>

      <Paper className="p-4 bg-white shadow-md mb-4">
        <Typography variant="h5" className="mb-2 font-semibold">予約済みゲスト一覧</Typography>
        {property.bookings && property.bookings.length > 0 ? (
          <ul>
            {property.bookings.map((booking) => (
              <li key={booking.id} className="mb-2 flex justify-between items-center">
                <Typography>
                  {booking.guestName} ({booking.guestEmail}) - 
                  {new Date(booking.startDate.seconds * 1000).toLocaleDateString('ja-JP')} から
                  {new Date(booking.endDate.seconds * 1000).toLocaleDateString('ja-JP')} まで
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => onDeleteBooking(booking.id)}
                  startIcon={<FaTrash />}
                >
                  削除
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <Typography>予約はありません。</Typography>
        )}
      </Paper>

      <Paper className="p-4 bg-white shadow-md">
        <Typography variant="h5" className="mb-2 font-semibold">iCal フィード</Typography>
        <Typography variant="body1" className="mb-2">
          以下のURLを使用して、この物件の予約をカレンダーアプリケーションと同期できます：
        </Typography>
        <TextField
          fullWidth
          value={property.icalUrl}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
        />
        <div className="mt-2 flex space-x-2">
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaClipboard />}
            onClick={() => property.icalUrl && navigator.clipboard.writeText(property.icalUrl)}
          >
            URLをコピー
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onRegenerateToken}
          >
            新しいトークンを生成
          </Button>
        </div>
        <Typography variant="body2" className="mt-4 text-red-600 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          注意：このURLには個人情報が含まれています。取り扱いには十分注意してください。
        </Typography>
      </Paper>
    </section>
  );
};

export default AdminSection;