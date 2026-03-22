/**
 * DateRangeFilter - Date range picker for filtering transactions
 * Uses shadcn/ui Popover + Calendar components with theme variables
 */

import * as React from "react";
import { Button } from "@pharos-one/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@pharos-one/ui/components/popover";
import { Calendar } from "@pharos-one/ui/components/calendar";
import { cn } from "@pharos-one/ui/lib/utils";
import { CalendarIcon, XIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

interface DateRangeFilterProps {
  dateFrom: Date | null;
  dateTo: Date | null;
  onChange: (dateFrom: Date | null, dateTo: Date | null) => void;
}

export const DateRangeFilter = React.forwardRef<
  HTMLButtonElement,
  DateRangeFilterProps
>(({ dateFrom, dateTo, onChange }, ref) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      onChange(range.from || null, range.to || null);
    } else {
      onChange(null, null);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null, null);
  };

  const hasSelection = dateFrom || dateTo;

  const formatDateRange = () => {
    if (!dateFrom && !dateTo) return "Date Range";
    if (dateFrom && !dateTo) {
      return `From ${dateFrom.toLocaleDateString()}`;
    }
    if (!dateFrom && dateTo) {
      return `Until ${dateTo.toLocaleDateString()}`;
    }
    return `${dateFrom?.toLocaleDateString()} - ${dateTo?.toLocaleDateString()}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5",
            hasSelection && "border-primary text-primary",
          )}
        >
          <CalendarIcon className="size-3.5" />
          <span className="max-w-[120px] truncate">{formatDateRange()}</span>
          {hasSelection && (
            <button
              type="button"
              onClick={handleClear}
              className="ml-1 rounded-sm hover:bg-primary/20"
            >
              <XIcon className="size-3" />
            </button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          selected={{
            from: dateFrom || undefined,
            to: dateTo || undefined,
          }}
          onSelect={handleSelect}
          numberOfMonths={2}
          defaultMonth={dateFrom || new Date()}
        />
      </PopoverContent>
    </Popover>
  );
});

DateRangeFilter.displayName = "DateRangeFilter";
