import { isValidUUID, formatPrice } from "utilities/utils";

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

  it('should round a price down correctly (Banker\'s rounding)', () => {
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
