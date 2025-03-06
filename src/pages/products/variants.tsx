import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Reorder } from "framer-motion";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiDraggable } from "react-icons/ri";

export default function ProductVariants() {
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
        <div className="flex items-center gap-2">
          <Button variant={"link"} className="!p-0">
            <RiDraggable size={16} />
          </Button>
          <Input
            type="text"
            name="discount"
            max={100}
            placeholder="variant name "
            className="min-w-max rounded-xs border-none shadow-md"
          />
          <Input
            type="number"
            name="discount"
            max={100}
            placeholder="1 - 100"
            className="min-w-[100px] rounded-xs border-none shadow-md"
          />
          <Select defaultValue="percentage">
            <SelectTrigger className="min-w-[100px] rounded-xs border-none shadow-md">
              <SelectValue placeholder="Select a Value" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="percentage">% off</SelectItem>
                <SelectItem value="flat">flat off</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* </Reorder.Item>
        </Reorder.Group> */}
      </CollapsibleContent>
    </Collapsible>
  );
}
