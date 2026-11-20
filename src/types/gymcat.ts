export type CatStage = 1 | 2 | 3 | 4;

export interface CatStageMeta {
  stage: CatStage;
  name: string;
  title: string;
  minDays: number;
  accentColor: string;
  badgeBackground: string;
  description: string;
}

export interface MonthlySummary {
  year: number;
  month: number; // 0-indexed (0 = Jan, 11 = Dec)
  monthLabel: string;
  daysInMonth: number;
  elapsedDays: number;
  gymDays: number;
  restDays: number;
  consistencyPercent: number;
  officialMonthlyStreak: number;
  stageMeta: CatStageMeta;
}
