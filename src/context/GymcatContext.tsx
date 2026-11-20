import * as Haptics from 'expo-haptics';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppState, Platform } from 'react-native';
import {
  buildMonthlySummary,
  formatDateKey,
  loadCheckins,
  saveCheckins,
  toggleCheckinDate,
} from '../storage/checkins';
import type { MonthlySummary } from '../types/gymcat';

interface GymcatContextValue {
  checkins: string[];
  isLoaded: boolean;
  today: Date;
  todayKey: string;
  todayLabel: string;
  isCheckedInToday: boolean;
  summary: MonthlySummary;
  handleCheckInToday: () => void;
  handleUndoToday: () => void;
  handleToggleDate: (dateKey: string) => void;
  triggerHaptic: (type: 'success' | 'selection') => void;
}

const GymcatContext = createContext<GymcatContextValue | null>(null);

export function triggerHaptic(type: 'success' | 'selection'): void {
  if (Platform.OS === 'web') return;
  const promise =
    type === 'success'
      ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      : Haptics.selectionAsync();
  void promise.catch(() => {});
}

export function GymcatProvider({ children }: { children: React.ReactNode }) {
  const [checkins, setCheckins] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [today, setToday] = useState(() => new Date());

  const todayKey = useMemo(() => formatDateKey(today), [today]);
  const todayLabel = useMemo(
    () =>
      today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
    [today],
  );

  useEffect(() => {
    let mounted = true;
    loadCheckins().then((loaded) => {
      if (mounted) {
        setCheckins(loaded);
        setIsLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        const now = new Date();
        setToday((prev) => (formatDateKey(prev) === formatDateKey(now) ? prev : now));
      }
    });
    return () => sub.remove();
  }, []);

  const summary = useMemo(
    () => buildMonthlySummary(checkins, today),
    [checkins, today],
  );

  const isCheckedInToday = checkins.includes(todayKey);

  const updateCheckins = (next: string[]) => {
    setCheckins(next);
    void saveCheckins(next);
  };

  const handleCheckInToday = () => {
    if (!isLoaded || isCheckedInToday) return;
    const next = toggleCheckinDate(checkins, todayKey);
    updateCheckins(next);
    triggerHaptic('success');
  };

  const handleUndoToday = () => {
    if (!isLoaded || !isCheckedInToday) return;
    const next = toggleCheckinDate(checkins, todayKey);
    updateCheckins(next);
    triggerHaptic('selection');
  };

  const handleToggleDate = (dateKey: string) => {
    if (!isLoaded) return;
    const willAdd = !checkins.includes(dateKey);
    const next = toggleCheckinDate(checkins, dateKey);
    updateCheckins(next);
    if (willAdd && dateKey === todayKey) {
      triggerHaptic('success');
    } else {
      triggerHaptic('selection');
    }
  };

  const value = useMemo<GymcatContextValue>(
    () => ({
      checkins,
      isLoaded,
      today,
      todayKey,
      todayLabel,
      isCheckedInToday,
      summary,
      handleCheckInToday,
      handleUndoToday,
      handleToggleDate,
      triggerHaptic,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkins, isLoaded, today, todayKey, todayLabel, isCheckedInToday, summary],
  );

  return <GymcatContext.Provider value={value}>{children}</GymcatContext.Provider>;
}

export function useGymcat(): GymcatContextValue {
  const ctx = useContext(GymcatContext);
  if (!ctx) {
    throw new Error('useGymcat must be used inside GymcatProvider');
  }
  return ctx;
}
