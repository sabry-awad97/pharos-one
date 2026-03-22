/**
 * TransactionTypeFilter - Multi-select filter for transaction types
 * Uses shadcn/ui composable pattern with theme variables
 */

import * as React from "react";
import { Button } from "@pharos-one/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@pharos-one/ui/components/popover";
import { cn } from "@pharos-one/ui/lib/utils";
import { CheckIcon, FilterIcon } from "lucide-react";
import type { TransactionType } from "../../schema";

const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  purchase: "Purchase",
  sale: "Sale",
  adjustment: "Adjustment",
  transfer: "Transfer",
  return: "Return",
  damage: "Damage",
  expiry: "Expiry",
};

const TRANSACTION_TYPES: TransactionType[] = [
  "purchase",
  "sale",
  "adjustment",
  "transfer",
  "return",
  "damage",
  "expiry",
];

interface TransactionTypeFilterProps {
  value: TransactionType[];
  onChange: (types: TransactionType[]) => void;
}

export const TransactionTypeFilter = React.forwardRef<
  HTMLButtonElement,
  TransactionTypeFilterProps
>(({ value, onChange }, ref) => {
  const [open, setOpen] = React.useState(false);

  const toggleType = (type: TransactionType) => {
    if (value.includes(type)) {
      onChange(value.filter((t) => t !== type));
    } else {
      onChange([...value, type]);
    }
  };

  const selectedCount = value.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5 font-normal",
            selectedCount > 0 && "border-primary text-primary",
          )}
        >
          <FilterIcon className="size-3.5" />
          Type
          {selectedCount > 0 && (
            <span className="ml-1 rounded-sm bg-primary px-1 py-0.5 text-[0.625rem] text-primary-foreground">
              {selectedCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2">
        <div className="flex flex-col gap-1">
          {TRANSACTION_TYPES.map((type) => {
            const isSelected = value.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isSelected && "bg-accent text-accent-foreground",
                )}
              >
                <div
                  className={cn(
                    "flex size-4 items-center justify-center rounded-sm border border-border",
                    isSelected &&
                      "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  {isSelected && <CheckIcon className="size-3" />}
                </div>
                <span className="flex-1 text-left">
                  {TRANSACTION_TYPE_LABELS[type]}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
});

TransactionTypeFilter.displayName = "TransactionTypeFilter";
