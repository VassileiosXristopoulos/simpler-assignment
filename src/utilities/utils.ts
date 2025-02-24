import { Discount } from "types";

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

// TODO: check discount calculations
export function getDiscountValue({ selectedDiscount, totalItems = 0, total = 0 }: {
  totalItems?: number;
  total: number;
  selectedDiscount: Discount | null;
}): number {
  if (!selectedDiscount) return 0;

  switch (selectedDiscount.type) {
    case "FLAT":
      return selectedDiscount.amount;

    case "PERCENTAGE":
      return (selectedDiscount.amount / 100) * total;

    case "BOGO":
      // Buy One Get One Free: Assume every second item is free
      if (totalItems === 0) return 0;
      const freeItems = Math.floor(totalItems / 2);
      const discountPerItem = total / totalItems;
      return freeItems * discountPerItem;

    default:
      return 0;
  }
}
