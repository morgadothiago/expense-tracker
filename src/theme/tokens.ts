export const colors = {
  brand: {
    primary: '#4F46E5', // Indigo 600
    primaryDark: '#3730A3', // Indigo 800
    primaryLight: '#EEF2FF', // Indigo 50
  },
  semantic: {
    danger: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  neutral: {
    900: '#0F172A', // Slate 900
    700: '#334155', // Slate 700
    500: '#64748B', // Slate 500
    300: '#CBD5E1', // Slate 300
    200: '#E2E8F0', // Slate 200
    100: '#F1F5F9', // Slate 100 — screen bg
    0: '#FFFFFF',
  },
  category: [
    '#EF4444', // Red
    '#F97316', // Orange
    '#EAB308', // Yellow
    '#22C55E', // Green
    '#14B8A6', // Teal
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#84CC16', // Lime
  ],
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const type = {
  display: { fontSize: 38, fontWeight: '800' as const, lineHeight: 46 },
  heading: { fontSize: 20, fontWeight: '700' as const, lineHeight: 28 },
  title: { fontSize: 17, fontWeight: '700' as const, lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  label: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  badge: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
  badgeSm: { fontSize: 11, fontWeight: '600' as const, lineHeight: 14 },
  amount: { fontSize: 17, fontWeight: '700' as const, lineHeight: 22 },
  amountLg: { fontSize: 38, fontWeight: '800' as const, lineHeight: 46 },
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
} as const;

export const shadow = {
  sm: {
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const touch = {
  minSize: 44,
  colorSwatch: 36,
} as const;

export const layout = {
  screenPadding: 16,
  maxContent: 600,
  fabSize: 56,
  fabBottom: 24,
} as const;
