import React, { useState } from 'react'
import { Tag } from 'lucide-react';
import { Button } from './buttons/Button';
import { Discount } from 'types';
import { useFetch } from 'hooks/useFetch';
import { getDiscounts } from 'api/cartApi';

type DiscountSelectorProps = {
  selectedDiscount: Discount | null;
  onApplyDiscount: (discount: Discount) => void;
  onRemoveDiscount: () => void;
}
export default function DiscountSelector({ selectedDiscount, onApplyDiscount, onRemoveDiscount }: DiscountSelectorProps) {
  const { data: discounts } = useFetch<Discount[]>(getDiscounts, []);
  const [error, setError] = useState('');
  const [inputCode, setInputCode] = React.useState('');

  const handleApplyDiscount = () => {
    const code = inputCode.trim().toUpperCase();
    if (!code) {
      setError('Please enter a discount code');
      return;
    }
    const appliedDiscount = discounts?.find((dicount) => dicount.code === code)
    if (appliedDiscount) {
      // applyDiscount(code);
      onApplyDiscount(appliedDiscount)
      setInputCode('');
      setError('');
    } else {
      setError('Invalid discount code');
    }
  };

  return (
    <div className="space-y-2">
    {selectedDiscount ? (
      <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-green-600" />
          <span className="text-green-700 font-medium">
            Code applied: {selectedDiscount.code}
          </span>
        </div>
        <button
          onClick={onRemoveDiscount}
          className="text-sm text-green-600 hover:text-green-700"
        >
          Remove
        </button>
      </div>
    ) : (
      <>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => {
              setInputCode(e.target.value);
              setError('');
            }}
            placeholder="Enter discount code"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button
            onClick={handleApplyDiscount}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            disabled={!inputCode}
          >
            Apply
          </Button>
        </div>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </>
    )}
  </div>
  )
}
