import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import React, { useEffect, useState } from 'react';
import DayPicker from "react-day-picker";
import { checkIfDateLiesBetweenTwoDates, Cycle, DateRange, generateTimesheetSkeleton, getDateRangeFromRanges } from '../utils/TimesheetsUtils';

function useTimesheetCalendar(placementSettings: DateRange, cycles: Cycle[]) {

  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);
  const [selectedRange, setRange] = useState<Date[]>([]);

  useEffect(() => {
    const ranges = generateTimesheetSkeleton(cycles, placementSettings.endDate);
    setDateRanges(ranges);
  }, []);

  const handleDateSelection = (date: Date) => {
    if (differenceInCalendarDays(new Date(), date) < 0) {
      setRange([date]);
    } else {
      const range = getDateRangeFromRanges(date, dateRanges);
      const checkTodayDateIncludesOrNot = checkIfDateLiesBetweenTwoDates(new Date(), range.startDate, range.endDate);
      if (checkTodayDateIncludesOrNot) {
        setRange([date]);
      } else {
        const selectionRange = eachDayOfInterval({
          start: range.startDate,
          end: range.endDate
        });
        setRange(selectionRange);
      }
    }
  };

  const renderCalendar = () => {
    return (
      <div>
        <DayPicker
          initialMonth={placementSettings.startDate}
          selectedDays={selectedRange}
          showOutsideDays
          onDayClick={handleDateSelection}
          // format={"MM/dd/yyyy"}
          disabledDays={[
            {
              after: placementSettings.endDate,
              before: placementSettings.startDate,
            },
          ]}
        />
      </div>
    );
  };

  return {
    renderCalendar,
    selectedRange
  };

}

export default useTimesheetCalendar;
