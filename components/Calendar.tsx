import React, { useMemo } from 'react';
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
  const months = useMemo(() => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const month = new Date(currentMonth);
      month.setMonth(currentMonth.getMonth() + i);
      result.push(month);
    }
    return result;
  }, [currentMonth]);

  const formattedEvents = useMemo(() => {
    return events.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    })).filter(event => {
      // 表示中の3ヶ月間のイベントのみをフィルタリング
      const eventMonth = event.start.getMonth();
      const eventYear = event.start.getFullYear();
      return months.some(month => 
        eventMonth >= month.getMonth() && eventMonth < month.getMonth() + 3 &&
        eventYear === month.getFullYear()
      );
    });
  }, [events, months]);

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    onMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    onMonthChange(newMonth);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrevMonth} className="text-sm">&lt;</button>
        <h2 className="text-sm font-semibold">
          {currentMonth.toLocaleString('ja-JP', { month: 'short', year: 'numeric' })} - 
          {months[2].toLocaleString('ja-JP', { month: 'short', year: 'numeric' })}
        </h2>
        <button onClick={handleNextMonth} className="text-sm">&gt;</button>
      </div>
      <div className="flex">
        {months.map((month, index) => (
          <div key={index} className="w-1/3 h-[500px] px-1">
            <BigCalendar
              localizer={localizer}
              events={formattedEvents}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              views={['month']}
              messages={{
                next: '次',
                previous: '前',
                today: '今日',
                month: '月',
              }}
              formats={{
                monthHeaderFormat: (date: Date) => date.toLocaleString('ja-JP', { month: 'short' }),
                dayFormat: (date: Date) => date.getDate().toString(),
              }}
              components={{
                toolbar: () => null,
              }}
              date={month}
              onNavigate={() => {}}
              onSelectEvent={(event) => console.log(event)}
              onSelectSlot={({ start }) => onDateClick(start)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;