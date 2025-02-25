import { useState } from 'react';

export function useCheckout(onCheckout: () => Promise<void>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setIsSubmitting(true);
      setError(null); // Reset error before making the request
      await onCheckout();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, handleCheckout };
}
