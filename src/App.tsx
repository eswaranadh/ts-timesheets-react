import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Cycle, generateTimesheetSkeleton } from './utils/TimesheetsUtils';
import useTimesheetCalendar from './hooks/useTimesheetCalendar';
import "react-day-picker/lib/style.css";


const placementSettings = {
  startDate: new Date('2021-03-03'),
  endDate: new Date('2022-03-17'),
};


const cycles: Cycle[] = [
  {
    date: new Date("2021-03-03"),
    range: 1,
    startDay: "Wednesday",
  },
  {
    date: new Date("2021-03-12"),
    range: 1,
    startDay: "Monday",
  },
  {
    date: new Date("2021-03-23"),
    range: 1,
    startDay: "Thursday",
  },
  {
    date: new Date("09/01/2021"),
    range: 2,
    startDay: "Wednesday",
  },
  {
    date: new Date("09/08/2021"),
    range: 3,
    startDay: "Wednesday",
  }
];


function App() {
  const { selectedRange, renderCalendar } = useTimesheetCalendar(placementSettings, cycles);
  console.log(selectedRange);

  return (
    <div className="App">
      {renderCalendar()}
    </div>
  );
}

export default App;
