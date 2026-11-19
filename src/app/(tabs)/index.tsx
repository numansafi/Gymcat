import React from 'react';
import { TodayScreen } from '../../screens/TodayScreen';
import { useGymcat } from '../../context/GymcatContext';

export default function TodayRoute() {
  const {
    isCheckedInToday,
    summary,
    todayLabel,
    handleCheckInToday,
    handleUndoToday,
  } = useGymcat();

  return (
    <TodayScreen
      isCheckedInToday={isCheckedInToday}
      stage={summary.stageMeta.stage}
      stageName={summary.stageMeta.name}
      todayLabel={todayLabel}
      onCheckInToday={handleCheckInToday}
      onUndoToday={handleUndoToday}
    />
  );
}
