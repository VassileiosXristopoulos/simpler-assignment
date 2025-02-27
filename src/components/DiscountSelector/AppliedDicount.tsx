import { Tag } from 'lucide-react';

type AppliedDicountProps = {
  code: string;
  onRemoveDiscount: () => void;
}

export default function AppliedDicount({ code, onRemoveDiscount }: AppliedDicountProps) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Tag size={18} className="text-green-600" />
        <span className="text-green-700 font-medium">
          Code applied: {code}
        </span>
      </div>
      <button
        onClick={onRemoveDiscount}
        className="text-sm text-green-600 hover:text-green-700"
      >
        Remove
      </button>
    </div>
  )
}
