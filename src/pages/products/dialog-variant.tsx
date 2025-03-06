import { Checkbox } from "@/components/ui/checkbox";

interface VariantProps {
  variant: {
    id: number;
    product_id: number;
    title: string;
    price: string;
  };
  checked: boolean;
  onVariantChange: (variantId: number, isChecked: boolean) => void;
}

export default function Variant({
  variant,
  checked,
  onVariantChange,
}: VariantProps) {
  return (
    <div className="flex items-center justify-between pl-6">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`variant-${variant.id}`}
          className="h-4 w-4"
          checked={checked}
          onCheckedChange={(isChecked: boolean) =>
            onVariantChange(variant.id, isChecked)
          }
        />
        <label
          htmlFor={`variant-${variant.id}`}
          className="text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {variant.title}
        </label>
      </div>
      <span className="text-xs font-medium">${variant.price}</span>
    </div>
  );
}
