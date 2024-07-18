import React from 'react';
import { Typography, TextField } from '@mui/material';
import { FaCalendarAlt } from 'react-icons/fa';

interface ICalSectionProps {
  icalUrl: string | undefined;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ICalSection: React.FC<ICalSectionProps> = ({
  icalUrl,
  onInputChange,
}) => {
  return (
    <section className="mb-8">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaCalendarAlt className="mr-2 text-indigo-600" /> iCal 設定
      </Typography>
      <TextField
        fullWidth
        name="icalUrl"
        label="iCal URL"
        value={icalUrl || ''}
        onChange={onInputChange}
        className="mb-4"
      />
    </section>
  );
};

export default ICalSection;