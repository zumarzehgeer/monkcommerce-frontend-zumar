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
import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import DialogVariant from "@/pages/products/dialog-variant";
import Variant from "@/pages/products/variants";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "@/api/getProducts";

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
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["products", searchQuery],
    queryFn: ({ pageParam }) => getProducts({ pageParam, searchQuery }),
    initialPageParam: 0,
    getNextPageParam: (_lastPage, allPages) => {
      if (1000 > allPages.length * 10) {
        return allPages.length + 1;
      } else {
        return undefined;
      }
    },
  });

  const queryClient = useQueryClient();
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    await queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const [showDiscount, setShowDiscount] = useState(false);
  const controls = useDragControls();

  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(
    product.selectedItem || null
  );
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

    let foundProduct = null;

    data?.pages.forEach((page) => {
      const found = page.find((p: SelectedItem) => p.id === selectedProductId);
      if (found) {
        foundProduct = found;
      }
    });

    if (foundProduct) {
      setSelectedItem(foundProduct);

      if (onProductSelected) {
        onProductSelected(foundProduct);
      }
    } else {
      setSelectedItem(null);

      if (onProductSelected) {
        onProductSelected(null);
      }
    }
  };

  const handleProductSelect = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProductId(productId);
      const productVariants = data?.pages.map((page) => {
        return (
          page.find((p: SelectedItem) => p.id === productId)?.variants || []
        );
      });

      if (productVariants) {
        setSelectedVariantIds(
          productVariants[0].map((v: SelectedItem) => v.id)
        );
      }
    } else {
      setSelectedProductId(null);
      setSelectedVariantIds([]);
    }
  };

  const handleVariantChange = (
    variantId: number,
    _productId: number,
    isChecked: boolean
  ) => {
    if (isChecked) {
      setSelectedVariantIds((prev) => [...prev, variantId]);
    } else {
      setSelectedVariantIds((prev) => prev.filter((id) => id !== variantId));
    }
  };

  const getTriggerText = () => {
    if (selectedItem) {
      return selectedItem.title;
    }
    return "Select Product";
  };

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (hasNextPage) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            console.log("Loading more products from intersection observer");
            fetchNextPage();
          }
        },
        {
          threshold: 0.1,
          root: scrollContainerRef.current,
          rootMargin: "100px",
        }
      );
      if (loadMoreRef.current) {
        observerRef.current.observe(loadMoreRef.current);
        console.log("Observer attached to loadMoreRef");
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, data?.pages.length]);

  const noProductsFound = data?.pages.every((page) => page === null);

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
              <Button className="rounded-xs bg-white shadow-lg hover:bg-white text-[#00000080]  justify-between w-80 overflow-hidden">
                <span className="truncate text-left">{getTriggerText()}</span>

                <MdModeEditOutline className="flex-shrink-0" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-sm p-0">
              {status === "pending" && (
                <div className="p-4 text-center">Loading products...</div>
              )}
              {status === "error" && (
                <div className="p-4 text-center text-red-500">
                  Error loading products: {error.message}
                </div>
              )}
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
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                </CardHeader>
                <CardContent
                  className="flex flex-col gap-2.5 max-h-[200px] overflow-y-auto search-area"
                  ref={scrollContainerRef}
                >
                  {status === "success" && (
                    <>
                      {noProductsFound ? (
                        <h2>No products found with the name {searchQuery}</h2>
                      ) : (
                        data.pages.map((page) => {
                          return page?.map(
                            (dataProduct: SelectedItem, index: number) => {
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
                                          handleProductSelect(
                                            dataProduct.id,
                                            checked
                                          );
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
                                      (variant, index: number) => {
                                        const isVariantChecked =
                                          selectedVariantIds.includes(
                                            variant.id
                                          ) && isProductChecked;

                                        return (
                                          <DialogVariant
                                            key={index}
                                            variant={variant}
                                            checked={isVariantChecked}
                                            onVariantChange={(
                                              variantId,
                                              isChecked
                                            ) =>
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
                            }
                          );
                        })
                      )}
                    </>
                  )}
                  {!noProductsFound && (
                    <div
                      ref={loadMoreRef}
                      className="py-2 text-center text-sm text-gray-500 mt-2"
                    >
                      <Button
                        onClick={() => fetchNextPage()}
                        disabled={!hasNextPage || isFetchingNextPage}
                        variant={"outline"}
                        className="text-black p-0 px-2 h-5 text-xs font-normal"
                      >
                        {isFetchingNextPage
                          ? "Loading more products..."
                          : hasNextPage
                          ? "Load products"
                          : "No more products to load"}
                      </Button>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="justify-end gap-2">
                  <DialogClose className="p-1.5 rounded-lg hover:bg-gray-300 duration-200 cursor-pointer px-4">
                    Cancel
                  </DialogClose>
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
                className="text-white rounded-xs min-w-[220px]"
                onClick={() => setShowDiscount(!showDiscount)}
              >
                Add Discount
              </Button>
            )}

            {showDiscount && (
              <div className="flex gap-3 w-[220px]">
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
        {selectedItem && <Variant selectedItem={selectedItem} />}
      </div>
    </Reorder.Item>
  );
}
