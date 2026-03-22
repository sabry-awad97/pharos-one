"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CalendarIcon,
  Check,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@pharos-one/ui/components/button";
import { Calendar } from "@pharos-one/ui/components/calendar";
import { Label } from "@pharos-one/ui/components/label";
import { Switch } from "@pharos-one/ui/components/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@pharos-one/ui/components/popover";
import { cn } from "@pharos-one/ui/lib/utils";
import { type DateRange } from "react-day-picker";

// Helper functions
const getPreviousPeriod = (start: Date, end: Date): [Date, Date] => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const newEnd = new Date(start);
  newEnd.setDate(newEnd.getDate() - 1);
  const newStart = new Date(newEnd);
  newStart.setDate(newStart.getDate() - diffDays);
  return [newStart, newEnd];
};

const getPreviousYear = (start: Date, end: Date): [Date, Date] => {
  const newStart = new Date(start);
  newStart.setFullYear(newStart.getFullYear() - 1);
  const newEnd = new Date(end);
  newEnd.setFullYear(newEnd.getFullYear() - 1);
  return [newStart, newEnd];
};

// Presets
const PRESETS = [
  { label: "Today", getValue: () => [new Date(), new Date()] as [Date, Date] },
  {
    label: "Yesterday",
    getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return [d, d] as [Date, Date];
    },
  },
  {
    label: "Last 7 days",
    getValue: () => {
      const d = new Date();
      const start = new Date();
      start.setDate(d.getDate() - 6);
      return [start, d] as [Date, Date];
    },
  },
  {
    label: "Last 14 days",
    getValue: () => {
      const d = new Date();
      const start = new Date();
      start.setDate(d.getDate() - 13);
      return [start, d] as [Date, Date];
    },
  },
  {
    label: "Last 30 days",
    getValue: () => {
      const d = new Date();
      const start = new Date();
      start.setDate(d.getDate() - 29);
      return [start, d] as [Date, Date];
    },
  },
  {
    label: "This Week",
    getValue: () => {
      const d = new Date();
      const day = d.getDay();
      const start = new Date(d);
      start.setDate(d.getDate() - day);
      return [start, d] as [Date, Date];
    },
  },
  {
    label: "Last Week",
    getValue: () => {
      const d = new Date();
      const day = d.getDay();
      const end = new Date(d);
      end.setDate(d.getDate() - day - 1);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      return [start, end] as [Date, Date];
    },
  },
  {
    label: "This Month",
    getValue: () => {
      const d = new Date();
      return [new Date(d.getFullYear(), d.getMonth(), 1), d] as [Date, Date];
    },
  },
  {
    label: "Last Month",
    getValue: () => {
      const d = new Date();
      const start = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      const end = new Date(d.getFullYear(), d.getMonth(), 0);
      return [start, end] as [Date, Date];
    },
  },
];

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

type CompareMode = "previous_period" | "previous_year" | "custom";

export const DateRangePicker = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(
  (
    {
      initialDateFrom,
      initialDateTo,
      initialCompareFrom,
      initialCompareTo,
      showCompare = true,
      onUpdate,
      size = "default",
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    // Use current date as fallback if no initial dates provided
    const defaultDate = new Date();

    const [range, setRange] = React.useState<DateRange>({
      from: initialDateFrom || defaultDate,
      to: initialDateTo || defaultDate,
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
    const [compareMode, setCompareMode] =
      React.useState<CompareMode>("previous_period");
    const [selectedPreset, setSelectedPreset] = React.useState<
      string | undefined
    >(undefined);

    // Sync temp state when opening
    React.useEffect(() => {
      if (isOpen) {
        setTempRange(range);
        setTempRangeCompare(rangeCompare);
        setTempIsComparing(isComparing);
      }
    }, [isOpen, range, rangeCompare, isComparing]);

    // Auto-calculate compare dates when primary dates or compare mode changes
    React.useEffect(() => {
      if (
        tempIsComparing &&
        tempRange.from &&
        tempRange.to &&
        compareMode !== "custom"
      ) {
        if (compareMode === "previous_period") {
          const [start, end] = getPreviousPeriod(tempRange.from, tempRange.to);
          setTempRangeCompare({ from: start, to: end });
        } else if (compareMode === "previous_year") {
          const [start, end] = getPreviousYear(tempRange.from, tempRange.to);
          setTempRangeCompare({ from: start, to: end });
        }
      }
    }, [tempRange, tempIsComparing, compareMode]);

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

    const handlePresetClick = (preset: (typeof PRESETS)[0]) => {
      const [start, end] = preset.getValue();
      setTempRange({ from: start, to: end });
      setSelectedPreset(preset.label);
    };

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            size={size}
            className={cn(
              "justify-start gap-2 font-normal",
              dateRangePickerVariants({ size }),
            )}
          >
            <CalendarIcon className="size-4" />
            <div className="flex flex-col items-start">
              <span className="font-normal">
                {formatDate(range.from)} - {formatDate(range.to)}
              </span>
              {isComparing && rangeCompare?.from && (
                <span className="text-[10px] font-normal text-muted-foreground">
                  vs {formatDate(rangeCompare.from)} -{" "}
                  {formatDate(rangeCompare.to)}
                </span>
              )}
            </div>
            {isOpen ? (
              <ChevronUp className="ml-auto size-4 opacity-50" />
            ) : (
              <ChevronDown className="ml-auto size-4 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0 overflow-visible">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col"
              >
                {/* Top Bar - Primary & Compare Controls */}
                <div className="flex flex-col border-b border-border">
                  {/* Row 1: Primary Range Display */}
                  <div className="flex items-center justify-between px-4 py-3">
                    {/* Compare Toggle */}
                    {showCompare && (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={tempIsComparing}
                          onCheckedChange={(checked) => {
                            setTempIsComparing(checked);
                            if (!checked) {
                              setTempRangeCompare(undefined);
                            } else if (tempRange.from && tempRange.to) {
                              // Auto-set to previous period when enabling
                              const [start, end] = getPreviousPeriod(
                                tempRange.from,
                                tempRange.to,
                              );
                              setTempRangeCompare({ from: start, to: end });
                            }
                          }}
                          id="compare-toggle-header"
                        />
                        <Label
                          htmlFor="compare-toggle-header"
                          className="cursor-pointer text-xs font-normal text-muted-foreground"
                        >
                          Compare
                        </Label>
                      </div>
                    )}

                    {/* Primary Range Pill */}
                    <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
                      <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5">
                        <CalendarDays className="size-3.5 text-primary" />
                        <span className="text-xs font-normal text-foreground">
                          {formatDate(tempRange.from) || "Start"}
                        </span>
                      </div>
                      <div className="px-1 text-muted-foreground">
                        <ArrowRight className="size-3.5" />
                      </div>
                      <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5">
                        <CalendarDays className="size-3.5 text-primary" />
                        <span className="text-xs font-normal text-foreground">
                          {formatDate(tempRange.to) || "End"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Compare Range (Animated) */}
                  <AnimatePresence>
                    {tempIsComparing && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-border"
                      >
                        <div className="flex items-center justify-between px-4 py-3">
                          {/* Compare Mode Selector */}
                          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
                            <Button
                              variant={
                                compareMode === "previous_period"
                                  ? "secondary"
                                  : "ghost"
                              }
                              size="sm"
                              onClick={() => setCompareMode("previous_period")}
                              className="h-7 text-[10px]"
                            >
                              Previous Period
                            </Button>
                            <Button
                              variant={
                                compareMode === "previous_year"
                                  ? "secondary"
                                  : "ghost"
                              }
                              size="sm"
                              onClick={() => setCompareMode("previous_year")}
                              className="h-7 text-[10px]"
                            >
                              Previous Year
                            </Button>
                            <Button
                              variant={
                                compareMode === "custom" ? "secondary" : "ghost"
                              }
                              size="sm"
                              onClick={() => setCompareMode("custom")}
                              className="h-7 text-[10px]"
                            >
                              Custom
                            </Button>
                          </div>

                          {/* Compare Range Pill */}
                          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
                            <div className="flex items-center gap-2 rounded-md bg-accent/10 px-3 py-1.5">
                              <CalendarDays className="size-3.5 text-accent-foreground" />
                              <span className="text-xs font-normal text-foreground">
                                {formatDate(tempRangeCompare?.from) || "Start"}
                              </span>
                            </div>
                            <div className="px-1 text-muted-foreground">
                              <ArrowRight className="size-3.5" />
                            </div>
                            <div className="flex items-center gap-2 rounded-md bg-accent/10 px-3 py-1.5">
                              <CalendarDays className="size-3.5 text-accent-foreground" />
                              <span className="text-xs font-normal text-foreground">
                                {formatDate(tempRangeCompare?.to) || "End"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-row-reverse">
                  {/* Calendar */}
                  <div className="flex-1 p-4">
                    <Calendar
                      mode="range"
                      selected={tempRange}
                      onSelect={(range) => {
                        if (range) {
                          setTempRange(range);
                          setSelectedPreset(undefined);
                        }
                      }}
                      numberOfMonths={2}
                      defaultMonth={tempRange.from}
                      classNames={{
                        day: "[&_button]:focus:ring-0 [&_button]:focus:ring-offset-0",
                      }}
                    />

                    {/* Compare Calendar */}
                    {tempIsComparing && compareMode === "custom" && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="size-2 rounded-full bg-accent" />
                          <span className="text-xs font-medium text-muted-foreground">
                            Compare Range
                          </span>
                        </div>
                        <Calendar
                          mode="range"
                          selected={tempRangeCompare}
                          onSelect={(range) => {
                            if (range) {
                              setTempRangeCompare(range);
                            }
                          }}
                          numberOfMonths={2}
                          defaultMonth={tempRangeCompare?.from}
                          classNames={{
                            day: "[&_button]:focus:ring-0 [&_button]:focus:ring-offset-0",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Presets Sidebar */}
                  <div className="w-36 border-r border-border p-2">
                    <div className="flex flex-col gap-0.5">
                      {PRESETS.map((preset) => (
                        <Button
                          key={preset.label}
                          variant={
                            selectedPreset === preset.label
                              ? "secondary"
                              : "ghost"
                          }
                          size="sm"
                          onClick={() => handlePresetClick(preset)}
                          className={cn(
                            "justify-between h-8 text-xs font-normal",
                            selectedPreset === preset.label && "font-medium",
                          )}
                        >
                          <span>{preset.label}</span>
                          {selectedPreset === preset.label && (
                            <Check className="size-3.5 text-primary" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border px-4 py-3">
                  {/* Legend */}
                  {tempIsComparing && (
                    <div className="flex items-center gap-3 text-[10px] font-normal text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <div className="size-2 rounded-full bg-primary" />
                        Primary
                      </span>
                      <span className="flex items-center gap-1.5">
                        <div className="size-2 rounded-full bg-accent" />
                        Compare
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-auto">
                    <Button variant="ghost" size={size} onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button size={size} onClick={handleApply}>
                      Apply
                    </Button>
                  </div>
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
