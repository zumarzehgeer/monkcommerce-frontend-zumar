import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
// import { Reorder } from "framer-motion";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiDraggable } from "react-icons/ri";
import { SelectedItem } from "./product";

export default function ProductVariants({
  selectedItem,
}: {
  selectedItem: SelectedItem | null;
}) {
  const [showVariants, setShowVariants] = useState(false);

  return (
    <Collapsible className="flex flex-col items-start">
      <CollapsibleTrigger asChild>
        <Button
          className="shadow-none border-none bg-transparent hover:bg-transparent !p-0 text-primary underline ml-auto duration-200"
          variant={"outline"}
          onClick={() => setShowVariants(!showVariants)}
        >
          {!showVariants ? "Show Variants" : "Hide Variants"}
          <MdKeyboardArrowDown
            className={`duration-300 transform ease-in ${
              !showVariants ? "" : "rotate-180"
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="w-[80%] m-auto">
        {/* <Reorder.Group
          axis="y"
          values={products}
          onReorder={handleReorder}
          className="flex flex-col gap-3"
        >
          <Reorder.Item
            value={product}
            id={product.id}
            dragListener={false}
            dragControls={controls}
          > */}
        {selectedItem?.variants.map((variant, index) => {
          return (
            <div className="flex items-center gap-2" key={index}>
              <Button variant={"link"} className="!p-0">
                <RiDraggable size={16} />
              </Button>
              <Input
                type="text"
                name="discount"
                max={100}
                placeholder="variant name "
                className="min-w-max rounded-xs border-none shadow-md"
                defaultValue={variant.title}
              />
              <Input
                type="number"
                name="price"
                max={100}
                placeholder="1 - 100"
                className="max-w-[100px] rounded-xs border-none shadow-md"
                defaultValue={variant.price}
              />
            </div>
          );
        })}

        {/* </Reorder.Item>
        </Reorder.Group> */}
      </CollapsibleContent>
    </Collapsible>
  );
}
