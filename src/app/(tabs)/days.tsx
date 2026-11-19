import React from 'react';
import { MonthlyDaysScreen } from '../../screens/MonthlyDaysScreen';
import { useGymcat } from '../../context/GymcatContext';

export default function DaysRoute() {
  const { checkins, today, handleToggleDate } = useGymcat();

  return (
    <MonthlyDaysScreen
      checkins={checkins}
      referenceDate={today}
      onToggleDate={handleToggleDate}
    />
  );
}
