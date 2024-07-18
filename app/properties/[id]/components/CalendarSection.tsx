import React from 'react';
import { Typography } from '@mui/material';
import { FaCalendarAlt } from 'react-icons/fa';
import Calendar from '../../../../components/Calendar';

interface CalendarSectionProps {
  calendarEvents: { start: Date; end: Date; title: string }[];
  currentMonth: Date;
  onMonthChange: (newMonth: Date) => void;
  onDateClick: (date: Date) => void;
  selectedStartDate: string | null;
  selectedEndDate: string | null;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({
  calendarEvents,
  currentMonth,
  onMonthChange,
  onDateClick,
  selectedStartDate,
  selectedEndDate,
}) => {
  if (calendarEvents.length === 0) return null;

  return (
    <section className="mb-8">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaCalendarAlt className="mr-2 text-indigo-600" /> 予約カレンダー
      </Typography>
      <Calendar 
        events={calendarEvents}
        currentMonth={currentMonth}
        onMonthChange={onMonthChange}
        onDateClick={onDateClick}
        selectedStartDate={selectedStartDate ? new Date(selectedStartDate) : null}
        selectedEndDate={selectedEndDate ? new Date(selectedEndDate) : null}
        unavailableDates={[]}
        maxStayDays={30}
      />
    </section>
  );
};

export default CalendarSection;