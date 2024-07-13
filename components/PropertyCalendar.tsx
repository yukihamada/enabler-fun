import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('ja');
const localizer = momentLocalizer(moment);

interface Event {
  start: Date;
  end: Date;
  title: string;
}

interface PropertyCalendarProps {
  events: Event[];
  availableDates: Date[];
  onSelectDate: (date: Date) => void;
}

const PropertyCalendar: React.FC<PropertyCalendarProps> = ({ events, availableDates, onSelectDate }) => {
  const eventStyleGetter = (event: Event) => {
    const style = {
      backgroundColor: '#ff0000',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };

  const dayPropGetter = (date: Date) => {
    if (availableDates.some(availableDate => moment(availableDate).isSame(date, 'day'))) {
      return {
        className: 'available-date',
        style: {
          backgroundColor: '#e6ffe6',
        }
      };
    }
    return {};
  };

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        onSelectSlot={(slotInfo) => onSelectDate(slotInfo.start)}
        selectable
      />
    </div>
  );
};

export default PropertyCalendar;