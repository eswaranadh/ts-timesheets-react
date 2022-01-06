import {
  addDays,
  differenceInCalendarDays,
  getDate,
  getDay,
  getDaysInMonth,
} from "date-fns";

export type WeekDays =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type Cycle = {
  date: Date;
  range: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startDay: WeekDays | undefined;
};

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

const getIndexByDay = (day: WeekDays) => {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const index = weekDays.indexOf(day);
  return index;
};

const getNextDate = (currCycle: Cycle) => {
  if (
    currCycle.startDay &&
    getIndexByDay(currCycle.startDay) !== getDay(currCycle.date)
  ) {
    const startDay = getIndexByDay(currCycle.startDay);
    const currDay = getDay(currCycle.date);
    const diff =
      startDay > currDay ? startDay - currDay : currDay - startDay - 1;
    return addDays(currCycle.date, diff - 1);
  }
  if (currCycle.range === 0) {
    return new Date(currCycle.date);
  } else if (currCycle.range === 1) {
    return addDays(new Date(currCycle.date), 6);
  } else if (currCycle.range === 2) {
    return addDays(new Date(currCycle.date), 13);
  } else if (currCycle.range === 3) {
    const day = getDate(currCycle.date);
    if (day >= 1 && day <= 15) {
      return addDays(new Date(currCycle.date), 15 - day);
    } else {
      const daysInMonth = getDaysInMonth(currCycle.date);
      return addDays(new Date(currCycle.date), daysInMonth - 16);
    }
  } else if (currCycle.range === 4) {
    const day = getDate(currCycle.date);
    const daysInMonth = getDaysInMonth(currCycle.date);
    return addDays(new Date(currCycle.date), daysInMonth - day);
  }

  return currCycle.date;
};

const formDateRangesBetweenTwoCycles = (
  currCycle: Cycle,
  nextCycle: Cycle
): DateRange[] => {
  /* 
    {
      date: Date,
      range: 0 | 1 | 2 | 3 | 4
      startDay: Sunday | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday
    }
  */
  const condition = differenceInCalendarDays(
    new Date(nextCycle.date),
    new Date(currCycle.date)
  );
  if (condition <= 0) return [];
  else {
    const nextDate = getNextDate(currCycle);
    const nextCondition = differenceInCalendarDays(
      new Date(nextCycle.date),
      nextDate
    );
    let formedRange: DateRange;
    if (nextCondition <= 0) {
      const diffInNextCycleDateAndCurrentRangeDate = differenceInCalendarDays(
        new Date(nextCycle.date),
        currCycle.date
      );
      formedRange = {
        startDate: currCycle.date,
        endDate: addDays(
          currCycle.date,
          diffInNextCycleDateAndCurrentRangeDate - 1
        ),
      };
    } else {
      formedRange = {
        startDate: new Date(currCycle.date),
        endDate: nextDate,
      };
    }

    currCycle = {
      date: addDays(nextDate, 1),
      range: currCycle.range,
      startDay: undefined,
    };
    let formedRanges = formDateRangesBetweenTwoCycles(currCycle, nextCycle);
    formedRanges = [...formedRanges, formedRange];
    return formedRanges;
  }
};

export const generateTimesheetSkeleton = (
  cycles: Cycle[],
  placementEndDate: Date
) => {
  // here cycles is an array of object, each object is in the following structure
  /* 
    {
      date: Date,
      range: 0 | 1 | 2 | 3 | 4
      startDay: Sunday | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday
    }

    range = 0 i.e Daily
    range = 1 i.e Weekly
    range = 2 i.e Bi-Weekly
    range = 3 i.e Semi-Monthly
    range = 4 i.e Monthly


  */
  let dateRanges: DateRange[] = [],
    i = 0;
  for (i = 0; i < cycles.length - 1; i++) {
    const ranges = formDateRangesBetweenTwoCycles(cycles[i], cycles[i + 1]);
    dateRanges = [...dateRanges, ...ranges];
  }
  const finalCycle: Cycle = {
    date: placementEndDate,
    range: cycles[i].range,
    startDay: cycles[i].startDay,
  };
  const finalFormingRanges = formDateRangesBetweenTwoCycles(
    cycles[i],
    finalCycle
  );
  dateRanges = [...dateRanges, ...finalFormingRanges];

  return dateRanges.sort((a, b) =>
    differenceInCalendarDays(a.startDate, b.startDate)
  );
};

export const checkIfDateLiesBetweenTwoDates = (
  date: Date,
  leftDate: Date,
  rightDate: Date
) => {
  const condition1 = differenceInCalendarDays(leftDate, date);
  const condition2 = differenceInCalendarDays(rightDate, date);
  return condition1 <= 0 && condition2 >= 0;
};

export const getDateRangeFromRanges = (
  selectedDate: Date,
  ranges: DateRange[]
): DateRange => {
  for (const i in ranges) {
    const dateRange = ranges[i];
    if (
      checkIfDateLiesBetweenTwoDates(
        selectedDate,
        dateRange.startDate,
        dateRange.endDate
      )
    ) {
      return dateRange;
    }
  }
  alert("Date range not found for the selected date");
  return {
    startDate: selectedDate,
    endDate: selectedDate,
  };
};
