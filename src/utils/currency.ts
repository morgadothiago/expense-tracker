const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(centavos: number): string {
  return formatter.format(centavos / 100);
}

export function parseCurrencyInput(input: string): number | null {
  const cleaned = input.replace(/[^\d,\.]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed) || parsed <= 0) return null;
  return Math.round(parsed * 100);
}
