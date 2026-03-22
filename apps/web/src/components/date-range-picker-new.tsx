"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@pharos-one/ui/components/button";
import { Calendar } from "@pharos-one/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@pharos-one/ui/components/popover";
import { cn } from "@pharos-one/ui/lib/utils";
import { type DateRange } from "react-day-picker";

// Size variants for DateRangePicker
const dateRangePickerVariants = cva("", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface DateRangePickerProps extends VariantProps<
  typeof dateRangePickerVariants
> {
  /** Initial start date */
  initialDateFrom?: Date;
  /** Initial end date */
  initialDateTo?: Date;
  /** Initial compare start date */
  initialCompareFrom?: Date;
  /** Initial compare end date */
  initialCompareTo?: Date;
  /** Show compare functionality */
  showCompare?: boolean;
  /** Callback when dates are updated */
  onUpdate?: (values: {
    range: DateRange;
    rangeCompare?: DateRange;
    isComparing: boolean;
  }) => void;
}

const formatDate = (
  date: Date | undefined,
  locale: string = "en-US",
): string => {
  if (!date) return "";
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const DateRangePicker = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(
  (
    {
      initialDateFrom = new Date(),
      initialDateTo = new Date(),
      initialCompareFrom,
      initialCompareTo,
      showCompare = true,
      onUpdate,
      size = "default",
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [range, setRange] = React.useState<DateRange>({
      from: initialDateFrom,
      to: initialDateTo,
    });
    const [rangeCompare, setRangeCompare] = React.useState<
      DateRange | undefined
    >(
      initialCompareFrom
        ? {
            from: initialCompareFrom,
            to: initialCompareTo,
          }
        : undefined,
    );
    const [isComparing, setIsComparing] = React.useState(
      Boolean(initialCompareFrom),
    );

    // Temporary state before Apply
    const [tempRange, setTempRange] = React.useState<DateRange>(range);
    const [tempRangeCompare, setTempRangeCompare] = React.useState<
      DateRange | undefined
    >(rangeCompare);
    const [tempIsComparing, setTempIsComparing] = React.useState(isComparing);

    // Sync temp state when opening
    React.useEffect(() => {
      if (isOpen) {
        setTempRange(range);
        setTempRangeCompare(rangeCompare);
        setTempIsComparing(isComparing);
      }
    }, [isOpen, range, rangeCompare, isComparing]);

    const handleApply = () => {
      setRange(tempRange);
      setRangeCompare(tempRangeCompare);
      setIsComparing(tempIsComparing);
      setIsOpen(false);

      onUpdate?.({
        range: tempRange,
        rangeCompare: tempIsComparing ? tempRangeCompare : undefined,
        isComparing: tempIsComparing,
      });
    };

    const handleCancel = () => {
      setTempRange(range);
      setTempRangeCompare(rangeCompare);
      setTempIsComparing(isComparing);
      setIsOpen(false);
    };

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            size={size}
            className={cn(
              "justify-start gap-2",
              dateRangePickerVariants({ size }),
            )}
          >
            <CalendarIcon className="size-4" />
            <div className="flex flex-col items-start">
              <span>
                {formatDate(range.from)} - {formatDate(range.to)}
              </span>
              {isComparing && rangeCompare?.from && (
                <span className="text-[10px] text-muted-foreground">
                  vs {formatDate(rangeCompare.from)} -{" "}
                  {formatDate(rangeCompare.to)}
                </span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col"
              >
                <div className="p-4">
                  <Calendar
                    mode="range"
                    selected={tempRange}
                    onSelect={(range) => {
                      if (range) {
                        setTempRange(range);
                      }
                    }}
                    numberOfMonths={2}
                    defaultMonth={tempRange.from}
                  />
                </div>
                <div className="flex justify-end gap-2 border-t border-border p-3">
                  <Button variant="ghost" size={size} onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size={size} onClick={handleApply}>
                    Apply
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </PopoverContent>
      </Popover>
    );
  },
);

DateRangePicker.displayName = "DateRangePicker";
