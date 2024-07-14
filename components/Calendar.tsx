import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';

interface CalendarProps {
  events: { start: Date; end: Date; title: string }[];
  currentMonth: Date;
  onMonthChange: (newMonth: Date) => void;
  onDateClick: (date: Date) => void;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  unavailableDates: Date[]; // 予約できない日付の配列
  maxStayDays: number; // 最大宿泊可能日数
}

const Calendar: React.FC<CalendarProps> = ({ events, currentMonth, onMonthChange, onDateClick, selectedStartDate, selectedEndDate, unavailableDates = [], maxStayDays }) => {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);

  const handleDateClick = (info: any) => {
    const clickedDate = info.date;
    if (isDateUnavailable(clickedDate)) return;

    if (!checkInDate) {
      setCheckInDate(clickedDate);
    } else {
      if (isValidCheckOutDate(clickedDate)) {
        onDateClick(checkInDate);
        onDateClick(clickedDate);
        setCheckInDate(null);
      }
    }
  };

  const isDateUnavailable = (date: Date) => {
    return Array.isArray(unavailableDates) && unavailableDates.some(unavailableDate => 
      unavailableDate.toDateString() === date.toDateString()
    );
  };

  const isValidCheckOutDate = (date: Date) => {
    if (!checkInDate) return false;
    const diffDays = Math.ceil((date.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= maxStayDays;
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale={jaLocale}
      events={events}
      initialDate={currentMonth}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek'
      }}
      datesSet={(dateInfo) => onMonthChange(dateInfo.view.currentStart)}
      dateClick={handleDateClick}
      dayCellClassNames={(arg) => {
        if (isDateUnavailable(arg.date)) return 'unavailable-date';
        if (checkInDate && isValidCheckOutDate(arg.date)) return 'valid-checkout-date';
        return '';
      }}
      height="auto"
      eventContent={(eventInfo) => (
        <div style={{ backgroundColor: 'gray', color: 'white', padding: '2px', borderRadius: '3px', fontSize: '0.8em' }}>
          {eventInfo.event.title}
          <br />
          {eventInfo.event.start?.toLocaleString('ja-JP')} - {eventInfo.event.end?.toLocaleString('ja-JP')}
        </div>
      )}
      slotMinTime="00:00:00"
      slotMaxTime="24:00:00"
      allDaySlot={false}
    />
  );
};

export default Calendar;