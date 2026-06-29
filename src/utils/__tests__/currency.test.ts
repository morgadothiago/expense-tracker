import { formatCurrency, parseCurrencyInput } from '../currency';

describe('formatCurrency', () => {
  test('CUR-01: standard amount', () => {
    expect(formatCurrency(4590)).toBe('R$ 45,90');
  });

  test('CUR-02: zero', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });

  test('CUR-03: exactly one real', () => {
    expect(formatCurrency(100)).toBe('R$ 1,00');
  });

  test('CUR-04: minimum unit (1 centavo)', () => {
    expect(formatCurrency(1)).toBe('R$ 0,01');
  });

  test('CUR-05: thousands separator', () => {
    expect(formatCurrency(100000)).toBe('R$ 1.000,00');
  });

  test('CUR-06: large number without overflow', () => {
    const result = formatCurrency(999999999);
    expect(result).toContain('R$');
    expect(result).toContain('9.999.999,99');
  });
});

describe('parseCurrencyInput', () => {
  test('PAR-01: Brazilian decimal format', () => {
    expect(parseCurrencyInput('45,90')).toBe(4590);
  });

  test('PAR-02: US decimal format', () => {
    expect(parseCurrencyInput('45.90')).toBe(4590);
  });

  test('PAR-03: integer input', () => {
    expect(parseCurrencyInput('45')).toBe(4500);
  });

  test('PAR-04: zero input', () => {
    expect(parseCurrencyInput('0')).toBeNull();
  });

  test('PAR-05: empty string', () => {
    expect(parseCurrencyInput('')).toBeNull();
  });

  test('PAR-06: non-numeric input', () => {
    expect(parseCurrencyInput('abc')).toBeNull();
  });

  test('PAR-07: minimum centavo', () => {
    expect(parseCurrencyInput('0,01')).toBe(1);
  });

  test('PAR-08: minus sign stripped (decimal-pad keyboard prevents negative input)', () => {
    expect(parseCurrencyInput('-5')).toBe(500);
  });
});
