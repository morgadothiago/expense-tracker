import {
  todayISO,
  monthFilterPattern,
  prevMonth,
  nextMonth,
  formatDateShort,
} from '../date';

describe('todayISO', () => {
  test('DAT-01: returns YYYY-MM-DD format', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('monthFilterPattern', () => {
  test('DAT-02: June 2026', () => {
    expect(monthFilterPattern(2026, 6)).toBe('2026-06-%');
  });

  test('DAT-03: single-digit month padded', () => {
    expect(monthFilterPattern(2026, 1)).toBe('2026-01-%');
  });

  test('DAT-04: December', () => {
    expect(monthFilterPattern(2026, 12)).toBe('2026-12-%');
  });
});

describe('prevMonth', () => {
  test('DAT-05: standard previous month', () => {
    expect(prevMonth(2026, 6)).toEqual({ year: 2026, month: 5 });
  });

  test('DAT-06: January crosses year boundary', () => {
    expect(prevMonth(2026, 1)).toEqual({ year: 2025, month: 12 });
  });
});

describe('nextMonth', () => {
  test('DAT-07: standard next month', () => {
    expect(nextMonth(2026, 6)).toEqual({ year: 2026, month: 7 });
  });

  test('DAT-08: December crosses year boundary', () => {
    expect(nextMonth(2026, 12)).toEqual({ year: 2027, month: 1 });
  });
});

describe('formatDateShort', () => {
  test('DAT-09: standard date', () => {
    expect(formatDateShort('2026-06-28')).toBe('28 jun');
  });

  test('DAT-10: January 1st', () => {
    expect(formatDateShort('2026-01-01')).toBe('1 jan');
  });

  test('DAT-11: December 31st', () => {
    expect(formatDateShort('2026-12-31')).toBe('31 dez');
  });
});
