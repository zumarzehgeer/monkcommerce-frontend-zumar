import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MdModeEditOutline } from "react-icons/md";
import { RiDraggable, RiCollapseVerticalFill } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { Reorder, useDragControls } from "framer-motion";
import { ProductData } from "@/pages/products/index";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Variant from "@/pages/products/dialog-variant";

const data = [
  {
    id: 77,
    title: "Fog Linen Chambray Towel - Beige Stripe",
    variants: [
      {
        id: 1,
        product_id: 77,
        title: "XS / Silver",
        price: "49",
      },
      {
        id: 2,
        product_id: 77,
        title: "S / Silver",
        price: "49",
      },
      {
        id: 3,
        product_id: 77,
        title: "M / Silver",
        price: "49",
      },
    ],
    image: {
      id: 266,
      product_id: 77,
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1",
    },
  },
  {
    id: 80,
    title: "Orbit Terrarium - Large",
    variants: [
      {
        id: 64,
        product_id: 80,
        title: "Default Title",
        price: "109",
      },
    ],
    image: {
      id: 272,
      product_id: 80,
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1",
    },
  },
];

export type SelectedItem = {
  id: number;
  title: string;
  variants: {
    id: number;
    product_id: number;
    title: string;
    price: string;
  }[];
  image: {
    id: number;
    product_id: number;
    src: string;
  };
};

export default function Product({
  product,
  onProductSelected,
}: {
  product: ProductData;
  onProductSelected?: (selectedItem: SelectedItem | null) => void;
}) {
  const [showDiscount, setShowDiscount] = useState(false);
  const controls = useDragControls();

  // Track selected item for this product
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(
    product.selectedItem || null
  );

  // Track currently selected product and variants in the dialog
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    selectedItem?.id || null
  );
  const [selectedVariantIds, setSelectedVariantIds] = useState<number[]>(
    selectedItem?.variants.map((v) => v.id) || []
  );

  const handleAddSelection = () => {
    if (!selectedProductId) {
      setSelectedItem(null);
      if (onProductSelected) {
        onProductSelected(null);
      }
      return;
    }

    const productData = data.find((p) => p.id === selectedProductId);

    if (productData) {
      // Create a product with only selected variants
      const productWithSelectedVariants = {
        ...productData,
        variants: productData.variants.filter((v) =>
          selectedVariantIds.includes(v.id)
        ),
      };

      // Only add if at least one variant is selected
      if (productWithSelectedVariants.variants.length > 0) {
        setSelectedItem(productWithSelectedVariants);

        if (onProductSelected) {
          onProductSelected(productWithSelectedVariants);
        }
      } else {
        setSelectedItem(null);

        if (onProductSelected) {
          onProductSelected(null);
        }
      }
    }
  };

  const handleProductSelect = (productId: number, checked: boolean) => {
    // Deselect previous product if a different one is selected
    if (checked) {
      setSelectedProductId(productId);

      // Pre-select all variants of the selected product
      const productVariants =
        data.find((p) => p.id === productId)?.variants || [];
      setSelectedVariantIds(productVariants.map((v) => v.id));
    } else {
      // If unchecked, clear the selection
      setSelectedProductId(null);
      setSelectedVariantIds([]);
    }
  };

  const handleVariantChange = (
    variantId: number,
    productId: number,
    isChecked: boolean
  ) => {
    if (isChecked) {
      // Add the variant to selected variants
      setSelectedVariantIds((prev) => [...prev, variantId]);
    } else {
      // Remove the variant from selected variants
      setSelectedVariantIds((prev) => prev.filter((id) => id !== variantId));
    }
  };

  // Handle removing the selected product
  const handleRemoveProduct = () => {
    setSelectedItem(null);
    setSelectedProductId(null);
    setSelectedVariantIds([]);

    if (onProductSelected) {
      onProductSelected(null);
    }
  };

  // Get display text for the trigger button
  const getTriggerText = () => {
    if (selectedItem) {
      // Show product title if selected
      return selectedItem.title;
    }
    return "Select Product";
  };

  return (
    <Reorder.Item
      value={product}
      id={product.id}
      dragListener={false}
      dragControls={controls}
    >
      <div className="flex flex-col">
        <div className="flex gap-3">
          <div
            className="flex items-center hover:cursor-pointer reorder-handle text-base"
            onPointerDown={(event) => controls.start(event)}
          >
            <RiDraggable size={16} />
            <span className="w-2.5">{product.index + 1}.</span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-xs bg-white shadow-lg hover:bg-white text-[#00000080] min-w-60 justify-between w-full overflow-hidden">
                <span className="truncate text-left">{getTriggerText()}</span>
                <MdModeEditOutline className="flex-shrink-0" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-sm p-0">
              <Card className="border-none shadow-none">
                <CardHeader className="gap-3">
                  <DialogTitle className="font-semibold">
                    Select a Product
                  </DialogTitle>
                  <div className="relative flex items-center">
                    <IoSearchOutline className="absolute left-2.5 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search"
                      className="pl-8"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2.5">
                  {data.map((dataProduct, index: number) => {
                    const isProductChecked =
                      selectedProductId === dataProduct.id;

                    return (
                      <Collapsible key={index}>
                        <div className="flex items-center gap-2 justify-between">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`${dataProduct.id}`}
                              className="h-6 w-6 text-white"
                              checked={isProductChecked}
                              onCheckedChange={(checked: boolean) => {
                                handleProductSelect(dataProduct.id, checked);
                              }}
                            />
                            <label
                              htmlFor={`${dataProduct.id}`}
                              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {dataProduct?.title}
                            </label>
                          </div>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant={"outline"}
                              size={"sm"}
                              className="border-none shadow-none h-5 w-5 hover:bg-transparent"
                            >
                              <RiCollapseVerticalFill />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="flex flex-col gap-2 my-2">
                          {dataProduct.variants.map(
                            (variant, vIndex: number) => {
                              const isVariantChecked =
                                selectedVariantIds.includes(variant.id) &&
                                isProductChecked;

                              return (
                                <Variant
                                  key={vIndex}
                                  variant={variant}
                                  checked={isVariantChecked}
                                  onVariantChange={(variantId, isChecked) =>
                                    handleVariantChange(
                                      variantId,
                                      variant.product_id,
                                      isChecked
                                    )
                                  }
                                />
                              );
                            }
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <DialogClose>Cancel</DialogClose>
                  <DialogClose asChild>
                    <Button className="text-white" onClick={handleAddSelection}>
                      Add
                    </Button>
                  </DialogClose>
                </CardFooter>
              </Card>
            </DialogContent>
          </Dialog>
          <div className="flex">
            {!showDiscount && (
              <Button
                variant={"default"}
                className="text-white rounded-xs"
                onClick={() => setShowDiscount(!showDiscount)}
              >
                Add Discount
              </Button>
            )}

            {showDiscount && (
              <div className="flex gap-3">
                <Input
                  type="number"
                  name="discount"
                  max={100}
                  placeholder="1 - 100"
                  className="min-w-[100px] rounded-xs border-none shadow-md"
                />
                <Select defaultValue="percentage">
                  <SelectTrigger className="max-w-[140px] rounded-xs border-none shadow-md">
                    <SelectValue placeholder="Select a Value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="percentage">% off</SelectItem>
                      <SelectItem value="flat">flat off</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  className="border-none shadow-none hover:bg-transparent"
                  onClick={() => setShowDiscount(!showDiscount)}
                >
                  <RxCross2 />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Display selected product */}
        {selectedItem && (
          <div className="ml-8 mt-3 mb-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2 border border-gray-200">
              <div className="flex items-center gap-2">
                {selectedItem.image && (
                  <img
                    src={selectedItem.image.src}
                    alt={selectedItem.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium text-sm">{selectedItem.title}</p>
                  <div className="text-xs text-gray-600">
                    {selectedItem.variants.map((variant, vidx) => (
                      <span key={vidx} className="mr-2">
                        {variant.title} - ${variant.price}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-500"
                onClick={handleRemoveProduct}
              >
                <RxCross2 />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Reorder.Item>
  );
}
