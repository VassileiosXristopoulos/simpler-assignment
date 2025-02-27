import { useState, useEffect } from 'react';
import { Discount } from 'types';
import { getDiscounts } from 'api/discountsApi';

type UseDiscountProps = {
  onApplyDiscount: (discount: Discount) => void;
}

export function useDiscounts({ onApplyDiscount }: UseDiscountProps) {
  const [discounts, setDiscounts] = useState<Discount[] | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setError('');
    try {
      const retrievedDiscounts = await getDiscounts();
      setDiscounts(retrievedDiscounts);
    } catch (error) {
      setError(`Error while fetching available discounts. ${error ? `Error message ${String(error)}` : ''}`);
    }
  };

  const handleApplyDiscount = (inputCode: string) => {
    const code = inputCode.trim().toUpperCase();
    if (!code) {
      setError('Please enter a discount code');
      return;
    }
    const appliedDiscount = discounts?.find((dicount) => dicount.code === code)
    if (appliedDiscount) {
      onApplyDiscount(appliedDiscount)
      setError('');
    } else {
      setError('Invalid discount code');
    }
  };

  return { discounts, error, handleApplyDiscount };
}
