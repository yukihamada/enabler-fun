import React from 'react';
import { Typography, TextField } from '@mui/material';
import { FaCalendarAlt } from 'react-icons/fa';
import { Timestamp } from 'firebase/firestore';

interface AvailabilityProps {
  availability: {
    availableFrom?: Timestamp;
    availableTo?: Timestamp;
  };
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      {isEditing ? (
        <>
          <TextField
            type="date"
            name="availableFrom"
            label="開始日"
            value={availability.availableFrom instanceof Timestamp 
              ? availability.availableFrom.toDate().toISOString().split('T')[0]
              : ''}
            onChange={onInputChange}
            className="mr-4"
          />
          <TextField
            type="date"
            name="availableTo"
            label="終了日"
            value={availability.availableTo instanceof Timestamp
              ? availability.availableTo.toDate().toISOString().split('T')[0]
              : ''}
            onChange={onInputChange}
          />
        </>
      ) : (
        <Typography>
          {availability.availableFrom && availability.availableTo
            ? `${formatDate(availability.availableFrom)} から ${formatDate(availability.availableTo)} まで`
            : '予約可能期間は設定されていません'}
        </Typography>
      )}
    </section>
  );
};

export default AvailabilitySection;