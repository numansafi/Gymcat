import React from 'react';
import { TodayScreen } from '../../screens/TodayScreen';
import { useGymcat } from '../../context/GymcatContext';

export default function TodayRoute() {
  const {
    isCheckedInToday,
    todayLabel,
    handleCheckInToday,
    handleUndoToday,
  } = useGymcat();

  return (
    <TodayScreen
      isCheckedInToday={isCheckedInToday}
      todayLabel={todayLabel}
      onCheckInToday={handleCheckInToday}
      onUndoToday={handleUndoToday}
    />
  );
}
