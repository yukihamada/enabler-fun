import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('ja');
const localizer = momentLocalizer(moment);

interface CalendarProps {
  events: any[];
  currentMonth: Date;
  onMonthChange: (newMonth: Date) => void;
  onDateClick: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, currentMonth, onMonthChange, onDateClick }) => {
  const formattedEvents = events.map(event => ({
    start: new Date(event.start),
    end: new Date(event.end),
    title: event.summary,
  }));

  return (
    <div style={{ height: '500px' }}>
      <BigCalendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        views={['month']}
        messages={{
          next: '次へ',
          previous: '前へ',
          today: '今日',
          month: '月',
        }}
      />
    </div>
  );
};

export default Calendar;