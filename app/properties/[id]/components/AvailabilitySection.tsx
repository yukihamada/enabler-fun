import React, { ReactNode, useState, useEffect } from 'react';
import { Typography, Button, Paper, Box, Chip, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { styled } from '@mui/system';
import { Theme, useTheme } from '@mui/material/styles';
import { Timestamp } from 'firebase/firestore';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { alpha } from '@mui/material/styles';

interface AvailabilitySectionProps {
  availability: {
    availableFrom: Timestamp | undefined;
    availableTo: Timestamp | undefined;
  };
  isEditing: boolean;
  formatDate: (date: Date | Timestamp | string | undefined) => string;
  icalUrls: string[] | undefined;
  availableDates: Date[];
  selectedStartDate: Date | null;
  setSelectedStartDate: (date: Date | null) => void;
  selectedEndDate: Date | null;
  setSelectedEndDate: (date: Date | null) => void;
  onReserve: () => void;
  isLoggedIn: boolean;
  children: ReactNode;
  pricePerNight: number; // 1泊あたりの料金を追加
}

const StyledCalendar = styled(Calendar)(({ theme }: { theme: Theme }) => ({
  width: '100%',
  maxWidth: 400,
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: theme.shape.borderRadius,
  fontFamily: theme.typography.fontFamily,
  '& .react-calendar__navigation': {
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  '& .react-calendar__navigation button': {
    minWidth: '44px',
    background: 'none',
    fontSize: '1.4rem',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    '&:disabled': {
      opacity: 0.3,
    },
  },
  '& .react-calendar__month-view__weekdays': {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    marginBottom: '0.5rem',
  },
  '& .react-calendar__tile': {
    aspectRatio: '1 / 1',
    maxWidth: '100%',
    padding: '0.75rem',
    background: 'none',
    borderRadius: '50%',
    fontSize: '1rem',
    color: theme.palette.text.primary,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  },
  '& .react-calendar__tile--now': {
    background: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  '& .react-calendar__tile--active': {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
  '& .available-date': {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.success.main, 0.2),
    },
  },
  '& .react-calendar__tile--active.available-date': {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
}));

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  availability,
  isEditing,
  formatDate,
  icalUrls,
  availableDates,
  selectedStartDate,
  setSelectedStartDate,
  selectedEndDate,
  setSelectedEndDate,
  onReserve,
  isLoggedIn,
  children,
  pricePerNight,
}) => {
  const theme = useTheme();
  const [selectedRange, setSelectedRange] = useState<[Date | null, Date | null]>([null, null]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  useEffect(() => {
    if (selectedRange[0] && selectedRange[1]) {
      const checkIn = selectedRange[0];
      const checkOut = selectedRange[1];
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      setTotalPrice(nights * pricePerNight);
    } else {
      setTotalPrice(0);
    }
  }, [selectedRange, pricePerNight]);

  const handleDateChange = (value: Date | [Date | null, Date | null]) => {
    if (Array.isArray(value)) {
      if (value[0]) {
        const checkIn = value[0];
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + 1);
        setSelectedRange([checkIn, checkOut]);
        setSelectedStartDate(checkIn);
        setSelectedEndDate(checkOut);
      } else {
        setSelectedRange(value);
        setSelectedStartDate(value[0]);
        setSelectedEndDate(value[1]);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // ここで予約処理を行う（APIを呼び出すなど）
    console.log('予約情報:', { selectedRange, guestCount, name, email, phone, totalPrice });
    onReserve(); // 既存の onReserve 関数を呼び出す
  };

  const tileClassName = ({ date }: { date: Date }) => {
    return availableDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    ) ? 'available-date' : '';
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    return !availableDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };

  return (
    <Paper elevation={3} sx={{ 
      p: 5, 
      borderRadius: 4,
      background: 'linear-gradient(145deg, #f3f4f6 0%, #ffffff 100%)',
      mb: 8,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    }}>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: 'primary.main', 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        fontSize: '1.75rem',
      }}>
        <CalendarIcon style={{ width: 32, height: 32, marginRight: 16 }} />
         予約フォーム
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        borderRadius: 4,
        p: 5,
        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      }}>
        <StyledCalendar
          theme={theme}
          selectRange={true}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
          locale="ja-JP"
          value={selectedRange}
        />
        {selectedRange[0] && selectedRange[1] && (
          <Box sx={{ mt: 5, width: '100%' }}>
            <TextField
              fullWidth
              value={`${formatDate(selectedRange[0])} から ${formatDate(selectedRange[1])} まで（${Math.ceil((selectedRange[1].getTime() - selectedRange[0].getTime()) / (1000 * 60 * 60 * 24))}泊）`}
              InputProps={{
                readOnly: true,
                startAdornment: <ClockIcon style={{ width: 24, height: 24, marginRight: 8 }} />,
              }}
              sx={{ mb: 3 }}
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="guest-count-label">宿泊人数</InputLabel>
              <Select
                labelId="guest-count-label"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                startAdornment={<UserIcon style={{ width: 24, height: 24, marginRight: 8 }} />}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>{num}人</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="お名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="電話番号"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <Typography variant="h6" sx={{ mb: 3 }}>
              合計金額: ¥{totalPrice.toLocaleString()}
            </Typography>
            <Button 
              type="submit"
              variant="contained" 
              color="primary" 
              disabled={!isLoggedIn}
              sx={{
                mt: 2,
                width: '100%',
                maxWidth: '400px',
                borderRadius: '25px',
                py: 2,
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
                },
                fontSize: '1.2rem',
                letterSpacing: '1px',
              }}
            >
              {isLoggedIn ? '予約する' : 'ログインして予約'}
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default AvailabilitySection;