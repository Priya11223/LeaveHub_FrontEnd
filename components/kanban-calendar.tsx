'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
}

interface KanbanCalendarProps {
  leaveType?: string;
  setStart: React.Dispatch<React.SetStateAction<string | null>>;
  setEnd: React.Dispatch<React.SetStateAction<string | null>>;
  onRequest?: () => void;
}

export default function KanbanCalendar({ leaveType, setStart, setEnd, onRequest}: KanbanCalendarProps) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  const [displayMonth, setDisplayMonth] = useState(currentMonth);
  const [displayYear, setDisplayYear] = useState(currentYear);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return false;
    const [minDate, maxDate] = start <= end ? [start, end] : [end, start];
    return date >= minDate && date <= maxDate;
  };

  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const daysInMonth = getDaysInMonth(displayMonth, displayYear);
    const firstDay = getFirstDayOfMonth(displayMonth, displayYear);
    const daysInPrevMonth = getDaysInMonth(displayMonth - 1, displayMonth === 0 ? displayYear - 1 : displayYear);
    
    const days: CalendarDay[] = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPast: true,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
      });
    }

    // Current month days
    for (let date = 1; date <= daysInMonth; date++) {
      const currentDate = new Date(displayYear, displayMonth, date);
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isPast = currentDate < todayDate;
      const isToday = 
        date === today.getDate() &&
        displayMonth === currentMonth &&
        displayYear === currentYear;
      
      const inRange = startDate && endDate && isDateInRange(currentDate, startDate, endDate);
      const isRangeStart = startDate && currentDate.getTime() === startDate.getTime();
      const isRangeEnd = endDate && currentDate.getTime() === endDate.getTime();

      days.push({
        date,
        isCurrentMonth: true,
        isPast,
        isToday,
        isSelected: false,
        isInRange: inRange || false,
        isRangeStart: isRangeStart || false,
        isRangeEnd: isRangeEnd || false,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let date = 1; date <= remainingDays; date++) {
      days.push({
        date,
        isCurrentMonth: false,
        isPast: true,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
      });
    }

    return days;
  };

  const handleNextMonth = () => {
    if (displayMonth < 11) { // Only allow navigation until December
      setDisplayMonth(displayMonth + 1);
    }
  };

  const handlePreviousMonth = () => {
    if (displayMonth > 0) { // Only allow navigation back to January
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleDayClick = (day: CalendarDay) => {
    if (day.isCurrentMonth && !day.isPast && !day.isToday) {
      const newDate = new Date(displayYear, displayMonth, day.date);
      
      // If no start date, or both dates are set, start new selection
      if (!startDate || (startDate && endDate)) {
        setStartDate(newDate);
        setEndDate(null);
        console.log('[v0] Start date set:', formatDateString(newDate));
      } else {
        // If only start date exists, set end date
        // Ensure startDate is always the earlier date and endDate the later date
        if (startDate && newDate < startDate) {
          // Swap so that startDate is the earlier date
          setStartDate(newDate);
          setEndDate(startDate);
          console.log('[v0] Dates swapped - Start: ', formatDateString(newDate), 'End: ', formatDateString(startDate));
        } else {
          setEndDate(newDate);
          console.log('[v0] End date set:', formatDateString(newDate));
        }
        if (startDate) {
          const rangeStart = newDate < startDate ? newDate : startDate;
          const rangeEnd = newDate < startDate ? startDate : newDate;
          const start = formatDateString(rangeStart);
          const end = formatDateString(rangeEnd)
          setStart(start);
          setEnd(end);
          console.log('[v0] Date range selected - Start: ', start, 'End: ', end);
        }
      }
    }
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-slide-in-left">
            {monthNames[displayMonth]} {displayYear}
          </h2>
          <p className="text-muted-foreground mt-2 animate-fade-in font-medium">
            {leaveType
              ? `Planning ${leaveType} leave`
              : displayMonth === currentMonth && displayYear === currentYear
              ? '📅 Current Month'
              : `📆 ${monthNames[displayMonth]} ${displayYear}`}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreviousMonth}
            disabled={displayMonth === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              displayMonth === 0
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/90 active:scale-95 hover:shadow-lg'
            }`}
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNextMonth}
            disabled={displayMonth === 11}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              displayMonth === 11
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 hover:shadow-lg'
            }`}
            title="Next Month"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-2xl border-2 border-border shadow-lg p-8 overflow-hidden">
        {/* Week Headers */}
        <div className="grid grid-cols-7 gap-4 mb-6">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-muted-foreground text-sm uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-4">
          {calendarDays.map((day, index) => {
            const isClickable = day.isCurrentMonth && !day.isPast && !day.isToday;
            const isRangeDay = day.isInRange && !day.isRangeStart && !day.isRangeEnd;

            return (
              <button
                key={index}
                onClick={() => handleDayClick(day)}
                disabled={!isClickable}
                className={`
                  aspect-square rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center border-2
                  ${
                    !day.isCurrentMonth
                      ? 'text-muted-foreground/30 bg-muted/20 cursor-default border-transparent'
                      : day.isPast
                      ? 'text-muted-foreground bg-muted/40 cursor-not-allowed border-muted/50'
                      : day.isToday
                      ? 'bg-primary/30 text-primary border-primary/50 font-bold cursor-not-allowed'
                      : day.isRangeStart || day.isRangeEnd
                      ? 'bg-primary text-primary-foreground border-primary font-bold hover:shadow-lg active:scale-95'
                      : isRangeDay
                      ? 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30'
                      : 'bg-background text-foreground border-border hover:border-primary hover:bg-primary/10 cursor-pointer active:scale-95'
                  }
                `}
              >
                {day.date}
              </button>
            );
          })}
        </div>

        {/* Selected Date Info */}
        {(startDate || endDate) && (
          <div className="mt-8 pt-8 border-t-2 border-primary/30 animate-slide-in-left">
            <p className="text-muted-foreground mb-3 text-sm font-medium uppercase tracking-wide">
              Selected Leave Period
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">Start Date</p>
                  <p className="text-xl font-bold text-primary">
                    {startDate ? formatDateString(startDate) : 'Not set'}
                  </p>
                </div>
                <span className="text-2xl text-primary/50 font-light">→</span>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">End Date</p>
                  <p className="text-xl font-bold text-primary">
                    {endDate ? formatDateString(endDate) : 'Not set'}
                  </p>
                </div>
              </div>
              {startDate && endDate && (
                <div className="mt-4 pt-4 border-t border-primary/20">
                  <p className="text-sm text-muted-foreground">Full range:</p>
                  <p className="text-lg font-semibold text-foreground">
                    {startDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })} → {endDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
            {/* Leave Requests Button */}
            {endDate && (<button type='button' onClick={() => onRequest?.()} className="mt-4 px-6 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors active:scale-95">
              Leave Requests
            </button>)}
          </div>
        )}
      </div>
    </div>
  );
}
