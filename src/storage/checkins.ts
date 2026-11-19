import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CatStageMeta, MonthlySummary } from '../types/gymcat';

const STORAGE_KEY = 'gymcat_checkins_v1';

export const CAT_STAGES: CatStageMeta[] = [
  {
    stage: 1,
    name: 'Fluff Pup',
    title: 'Tier 1 · Cozy Beginner',
    minDays: 0,
    accentColor: '#8B7CF6',
    badgeBackground: '#F1EEFF',
    description: 'Boba is stretching out and taking the first steps into the gym.',
  },
  {
    stage: 2,
    name: 'Getting Warmed Up',
    title: 'Tier 2 · Steady Spark',
    minDays: 4,
    accentColor: '#F59E0B',
    badgeBackground: '#FEF3C7',
    description: 'Headband on, paws chalked — Boba is finding a rhythm.',
  },
  {
    stage: 3,
    name: 'Athletic Gymcat',
    title: 'Tier 3 · Iron Regular',
    minDays: 10,
    accentColor: '#10B981',
    badgeBackground: '#D1FAE5',
    description: 'Strong, consistent, and zero-guilt. Boba owns the rack.',
  },
  {
    stage: 4,
    name: 'Giga-Cat',
    title: 'Tier 4 · Legendary Boba',
    minDays: 16,
    accentColor: '#EC4899',
    badgeBackground: '#FCE7F3',
    description: 'Peak feline form unlocked. Unstoppable monthly momentum.',
  },
];

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getMonthDaysCount(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getCatStageMeta(gymDays: number): CatStageMeta {
  let current = CAT_STAGES[0];
  for (const stage of CAT_STAGES) {
    if (gymDays >= stage.minDays) {
      current = stage;
    }
  }
  return current;
}

export function toggleCheckinDate(dates: string[], dateKey: string): string[] {
  const next = new Set(dates);
  if (next.has(dateKey)) {
    next.delete(dateKey);
  } else {
    next.add(dateKey);
  }
  return Array.from(next).sort();
}

export function calculateOfficialMonthlyStreak(
  year: number,
  month: number,
  checkedSet: Set<string>,
): number {
  const daysInMonth = getMonthDaysCount(year, month);
  let longest = 0;
  let current = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const key = formatDateKey(new Date(year, month, day));
    if (checkedSet.has(key)) {
      current += 1;
      if (current > longest) {
        longest = current;
      }
    } else {
      current = 0;
    }
  }

  return longest;
}

export function buildMonthlySummary(
  checkins: string[],
  referenceDate: Date = new Date(),
): MonthlySummary {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const daysInMonth = getMonthDaysCount(year, month);
  const elapsedDays = Math.min(referenceDate.getDate(), daysInMonth);
  const checkedSet = new Set(checkins);

  let gymDays = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const key = formatDateKey(new Date(year, month, day));
    if (checkedSet.has(key)) {
      gymDays += 1;
    }
  }

  const restDays = Math.max(0, elapsedDays - gymDays);
  const consistencyPercent =
    elapsedDays > 0 ? Math.min(100, Math.round((gymDays / elapsedDays) * 100)) : 0;

  const monthLabel = referenceDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return {
    year,
    month,
    monthLabel,
    daysInMonth,
    elapsedDays,
    gymDays,
    restDays,
    consistencyPercent,
    officialMonthlyStreak: calculateOfficialMonthlyStreak(year, month, checkedSet),
    stageMeta: getCatStageMeta(gymDays),
  };
}

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export async function loadCheckins(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter(
      (item): item is string => typeof item === 'string' && DATE_KEY_PATTERN.test(item),
    );
    return Array.from(new Set(valid)).sort();
  } catch {
    return [];
  }
}

export async function saveCheckins(dates: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dates));
  } catch {
    // Ignore storage write errors silently to keep UI responsive
  }
}
