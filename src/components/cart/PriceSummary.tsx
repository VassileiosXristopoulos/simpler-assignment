import { Discount } from 'types';
import { formatPrice } from 'utilities/utils';

interface PriceSummaryProps {
  subtotal: number;
  discountValue: number;
  selectedDiscount: Discount | null;
}

const PriceSummary = ({ subtotal, discountValue, selectedDiscount }: PriceSummaryProps) => (
  <div className="space-y-2 text-right">
    <p className="text-gray-600">
      Subtotal: {formatPrice(subtotal)}
    </p>
    {selectedDiscount && (
      <p className="text-green-600">
        Discount: -{formatPrice(discountValue)}
      </p>
    )}
    <p className="text-xl font-semibold">
      Total: {formatPrice(Math.max(0, subtotal - discountValue))}
    </p>
  </div>
);

export default PriceSummary;
