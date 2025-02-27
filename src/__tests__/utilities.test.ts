import { Discount } from "types";
import { isValidUUID, formatPrice, getDiscountValue } from "utilities/utils";

describe('isValidUUID', () => {
  it('should return true for a valid UUID', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    expect(isValidUUID(validUUID)).toBe(true);
  });

  it('should return false for a UUID with invalid format (too short)', () => {
    const invalidUUID = '123e4567-e89b-12d3-a456';
    expect(isValidUUID(invalidUUID)).toBe(false);
  });

  it('should return false for a UUID with invalid format (extra characters)', () => {
    const invalidUUID = '123e4567-e89b-12d3-a456-426614174000123';
    expect(isValidUUID(invalidUUID)).toBe(false);
  });

  it('should return false for non-string values', () => {
    const nonStringValues = [123, true, null, undefined, {}, []];
    nonStringValues.forEach(value => {
      expect(isValidUUID(value)).toBe(false);
    });
  });

  it('should return false for an empty string', () => {
    expect(isValidUUID('')).toBe(false);
  });
});

describe('formatPrice', () => {
  it('should format a price as USD currency', () => {
    const price = 100;
    expect(formatPrice(price)).toBe('$100.00');
  });

  it('should round a price up correctly', () => {
    const price = 100.005;
    expect(formatPrice(price)).toBe('$100.01');
  });

  it('should round a price up correctly (Banker\'s rounding)', () => {
    const price = 100.015;
    expect(formatPrice(price)).toBe('$100.02');
  });

  it('should format a price with two decimal places correctly', () => {
    const price = 99.99;
    expect(formatPrice(price)).toBe('$99.99');
  });

  it('should handle zero as a price correctly', () => {
    const price = 0;
    expect(formatPrice(price)).toBe('$0.00');
  });

  it('should handle negative prices', () => {
    const price = -100.5;
    expect(formatPrice(price)).toBe('-$100.50');
  });
});

describe('getDiscountValue', () => {
  it('should return 0 if no selectedDiscount is provided', () => {
    const result = getDiscountValue({ selectedDiscount: null, total: 100, totalItems: 2 });
    expect(result).toBe(0);
  });

  it('should return the flat discount amount for FLAT type discount', () => {
    const discount: Discount = { type: 'FLAT', amount: 20, code: "FLAT10" };
    const result = getDiscountValue({ selectedDiscount: discount, total: 100, totalItems: 2 });
    expect(result).toBe(20);
  });

  it('should return the percentage of the total for PERCENTAGE type discount', () => {
    const discount: Discount = { type: 'PERCENTAGE', amount: 5, code: "PCT5" }; // 5% discount
    const result = getDiscountValue({ selectedDiscount: discount, total: 200, totalItems: 3 });
    expect(result).toBe(10); // 5% of 200 is 10
  });

  it('should return the correct discount for BOGO type when totalItems is greater than 0', () => {
    const discount: Discount = { type: 'BOGO', code: "BOGO" }; // BOGO doesn't use the amount
    const result = getDiscountValue({ selectedDiscount: discount, total: 200, totalItems: 4 });
    expect(result).toBe(100); // 2 items free (total 4 items), each item worth 50, so total free value = 2 * 50 = 100
  });

  it('should return 0 for BOGO type when totalItems is 0', () => {
    const discount: Discount = { type: 'BOGO', code: "BOGO" };
    const result = getDiscountValue({ selectedDiscount: discount, total: 200, totalItems: 0 });
    expect(result).toBe(0); // No items, no discount
  });
});
