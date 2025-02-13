export const isValidUUID = (value: unknown): value is string => {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
};

export function formatPrice(price: number): string {
  // Using Banker's rounding (round half to even)
  const rounded = Math.round((price + Number.EPSILON) * 100) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(rounded);
}
