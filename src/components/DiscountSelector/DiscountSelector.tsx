import { Discount } from 'types';
import AppliedDicount from './AppliedDicount';
import DiscountInputForm from './DiscountInputForm';
import { useDiscounts } from 'components/DiscountSelector/hooks/useDiscounts';

type DiscountSelectorProps = {
  selectedDiscount: Discount | null;
  onApplyDiscount: (discount: Discount) => void;
  onRemoveDiscount: () => void;
}

export default function DiscountSelector({ selectedDiscount, onApplyDiscount, onRemoveDiscount }: DiscountSelectorProps) {
  const { discounts, error, handleApplyDiscount } = useDiscounts({ onApplyDiscount });
  return (
    <div className="space-y-2">
      {selectedDiscount ? (
        <AppliedDicount code={selectedDiscount.code} onRemoveDiscount={onRemoveDiscount} />
      ) : (
        discounts && discounts?.length > 0 && <DiscountInputForm onSubmit={handleApplyDiscount} />
      )}
      {(error) && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
