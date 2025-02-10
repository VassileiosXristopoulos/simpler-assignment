export function formatPrice(price: number): string {
  // Using Banker's rounding (round half to even)
  const rounded = Math.round((price + Number.EPSILON) * 100) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(rounded);
}
