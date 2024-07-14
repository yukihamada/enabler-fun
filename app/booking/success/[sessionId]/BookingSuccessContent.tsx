'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Typography, Container, Paper } from '@mui/material';

export default function BookingSuccessContent() {
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (sessionId) {
        const response = await fetch(`/api/get-session?session_id=${sessionId}`);
        const data = await response.json();
        setBookingDetails(data);
      }
    };

    fetchBookingDetails();
  }, [sessionId]);

  if (!bookingDetails) {
    return <Typography>読み込み中...</Typography>;
  }

  return (
    <Container maxWidth="md" className="py-8">
      <Paper className="p-6">
        <Typography variant="h4" className="mb-4">予約が完了しました</Typography>
        <Typography variant="body1">予約詳細：</Typography>
        <Typography>チェックイン: {new Date(bookingDetails.startDate).toLocaleDateString('ja-JP')}</Typography>
        <Typography>チェックアウト: {new Date(bookingDetails.endDate).toLocaleDateString('ja-JP')}</Typography>
        <Typography>合計金額: ¥{bookingDetails.amount.toLocaleString()}</Typography>
      </Paper>
    </Container>
  );
}