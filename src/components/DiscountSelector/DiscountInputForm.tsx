import { Button } from 'components/buttons/Button';
import React, { useState } from 'react';

type DiscountInputFormProps = {
  onSubmit: (inputCode: string) => void;
};

export default function DiscountInputForm({ onSubmit }: DiscountInputFormProps) {
  const [inputCode, setInputCode] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form submission from refreshing the page
    onSubmit(inputCode);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        placeholder="Enter discount code"
        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <Button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        disabled={!inputCode}
      >
        Apply
      </Button>
    </form>
  );
}
