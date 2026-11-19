import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

let storedRaw = null;
let shouldRejectGet = false;

mock.module('@react-native-async-storage/async-storage', {
  defaultExport: {
    getItem: async () => {
      if (shouldRejectGet) throw new Error('Storage unavailable');
      return storedRaw;
    },
    setItem: async (_key, value) => {
      storedRaw = value;
    },
  },
});

const {
  buildMonthlySummary,
  formatDateKey,
  getMonthDaysCount,
  loadCheckins,
  saveCheckins,
  toggleCheckinDate,
} = await import('../checkins.ts');

describe('checkins domain & persistence seams', () => {
  it('formats local calendar dates and counts month days including leap years', () => {
    assert.equal(formatDateKey(new Date(2026, 10, 1, 23, 59)), '2026-11-01');
    assert.equal(getMonthDaysCount(2024, 1), 29);
    assert.equal(getMonthDaysCount(2026, 1), 28);
    assert.equal(getMonthDaysCount(2026, 10), 30);
    assert.equal(getMonthDaysCount(2026, 11), 31);
  });

  it('toggles dates in sorted order without duplicates', () => {
    assert.deepEqual(toggleCheckinDate(['2026-11-03'], '2026-11-01'), [
      '2026-11-01',
      '2026-11-03',
    ]);
    assert.deepEqual(toggleCheckinDate(['2026-11-01', '2026-11-03'], '2026-11-01'), [
      '2026-11-03',
    ]);
  });

  it('builds monthly summary safely for empty and active months', () => {
    const empty = buildMonthlySummary([], new Date(2026, 10, 19));
    assert.equal(empty.gymDays, 0);
    assert.equal(empty.restDays, 19);
    assert.equal(empty.consistencyPercent, 0);
    assert.equal(empty.officialMonthlyStreak, 0);
    assert.equal(empty.stageMeta.stage, 1);

    const active = buildMonthlySummary(
      ['2026-10-31', '2026-11-01', '2026-11-02', '2026-11-04', '2026-11-05', '2026-11-06'],
      new Date(2026, 10, 10),
    );
    assert.equal(active.gymDays, 5);
    assert.equal(active.restDays, 5);
    assert.equal(active.consistencyPercent, 50);
    assert.equal(active.officialMonthlyStreak, 3);
    assert.equal(active.stageMeta.stage, 2);
  });

  it('loads, validates, deduplicates, and recovers gracefully from corrupt storage', async () => {
    shouldRejectGet = false;
    storedRaw = JSON.stringify(['2026-11-03', '2026-11-01', '2026-11-01', 'bad-date', 123]);
    assert.deepEqual(await loadCheckins(), ['2026-11-01', '2026-11-03']);

    storedRaw = 'not-json{';
    assert.deepEqual(await loadCheckins(), []);

    shouldRejectGet = true;
    assert.deepEqual(await loadCheckins(), []);

    shouldRejectGet = false;
    await saveCheckins(['2026-11-05']);
    assert.deepEqual(await loadCheckins(), ['2026-11-05']);
  });
});
