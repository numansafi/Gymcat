import React from 'react';
import { MonthCardScreen } from '../../screens/MonthCardScreen';
import { useGymcat } from '../../context/GymcatContext';

export default function CardRoute() {
  const { summary } = useGymcat();
  return <MonthCardScreen summary={summary} />;
}
