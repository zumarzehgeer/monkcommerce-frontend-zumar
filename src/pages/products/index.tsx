import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Product, { SelectedItem } from "@/pages/products/product";
import { useState } from "react";
import { Reorder } from "framer-motion";

export interface ProductData {
  id: string;
  index: number;
  selectedItem?: SelectedItem | null; // Store the selected item for each product
}

export default function Products() {
  // Initialize products with null selectedItem
  const [products, setProducts] = useState<ProductData[]>([
    { id: Date.now().toString(), index: 0, selectedItem: null },
  ]);

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        index: products.length,
        selectedItem: null,
      },
    ]);
  };

  const handleReorder = (newProducts: ProductData[]) => {
    const updatedProducts = newProducts.map((product, index) => ({
      ...product,
      index: index,
    }));
    setProducts(updatedProducts);
  };

  // Update the selectedItem for a specific product
  const handleProductSelected = (
    productId: string,
    selectedItem: SelectedItem | null
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, selectedItem } : product
      )
    );
  };

  return (
    <>
      <Card className="min-w-[600px] justify-around max-h-[600px] overflow-auto">
        <CardHeader className="flex-row justify-around">
          <span>Products</span>
          <span>Discount</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-3.5 items-center">
          <Reorder.Group
            axis="y"
            values={products}
            onReorder={handleReorder}
            className="flex flex-col gap-3 w-full"
          >
            {products.map((product) => (
              <Product
                key={product.id}
                product={product}
                onProductSelected={(selectedItem) => {
                  handleProductSelected(product.id, selectedItem);
                }}
              />
            ))}
          </Reorder.Group>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            className="rounded-xs text-xs border-2 font-semibold border-primary text-primary max-w-min hover:bg-primary hover:text-white duration-300 transition-all ease-in-out"
            variant={"outline"}
            onClick={addProduct}
          >
            Add Product
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
