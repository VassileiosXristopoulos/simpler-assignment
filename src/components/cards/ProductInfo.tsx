import { memo } from 'react'

type ProductInfoProps = {
  name: string;
  formattedPrice: string;
  availableStock: number;
  isOutOfStock: boolean;
}


export const ProductInfo = memo(({ name, formattedPrice, availableStock, isOutOfStock }: ProductInfoProps) => (
  <>
    <h3 className="text-lg font-semibold mb-2 text-gray-800">{name}</h3>
    <div className="space-y-1">
      <span className="text-xl font-bold text-blue-600">{formattedPrice}</span>
      <p className={`text-sm ${isOutOfStock ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
        {isOutOfStock ? 'Maximum quantity in cart' : `${availableStock} available`}
      </p>
    </div>
  </>
));
