"use client";

import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import React, { type FC, type JSX, useEffect, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Switch } from "./switch";
import { cn } from "../lib/utils";

interface DateInputProps {
  value?: Date;
  onChange: (date: Date) => void;
}

interface DateParts {
  day: number;
  month: number;
  year: number;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
  const [date, setDate] = React.useState<DateParts>(() => {
    const d = value ? new Date(value) : new Date();
    return {
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    };
  });

  const monthRef = useRef<HTMLInputElement | null>(null);
  const dayRef = useRef<HTMLInputElement | null>(null);
  const yearRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const d = value ? new Date(value) : new Date();
    setDate({
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    });
  }, [value]);

  const validateDate = (field: keyof DateParts, value: number): boolean => {
    if (
      (field === "day" && (value < 1 || value > 31)) ||
      (field === "month" && (value < 1 || value > 12)) ||
      (field === "year" && (value < 1000 || value > 9999))
    ) {
      return false;
    }

    const newDate = { ...date, [field]: value };
    const d = new Date(newDate.year, newDate.month - 1, newDate.day);
    return (
      d.getFullYear() === newDate.year &&
      d.getMonth() + 1 === newDate.month &&
      d.getDate() === newDate.day
    );
  };

  const handleInputChange =
    (field: keyof DateParts) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value ? Number(e.target.value) : "";
      const isValid =
        typeof newValue === "number" && validateDate(field, newValue);

      const newDate = { ...date, [field]: newValue };
      setDate(newDate);

      if (isValid && typeof newValue === "number") {
        const validDate = { ...date, [field]: newValue };
        onChange(new Date(validDate.year, validDate.month - 1, validDate.day));
      }
    };

  const initialDate = useRef<DateParts>(date);

  const handleBlur =
    (field: keyof DateParts) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      if (!e.target.value) {
        setDate(initialDate.current);
        return;
      }

      const newValue = Number(e.target.value);
      const isValid = validateDate(field, newValue);

      if (!isValid) {
        setDate(initialDate.current);
      } else {
        initialDate.current = { ...date, [field]: newValue };
      }
    };

  const handleKeyDown =
    (field: keyof DateParts) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.metaKey || e.ctrlKey) {
        return;
      }

      if (
        !/^[0-9]$/.test(e.key) &&
        ![
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Delete",
          "Tab",
          "Backspace",
          "Enter",
        ].includes(e.key)
      ) {
        e.preventDefault();
        return;
      }

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        let newDate = { ...date };

        if (field === "day") {
          if (e.key === "ArrowUp") {
            if (date[field] === new Date(date.year, date.month, 0).getDate()) {
              newDate = { ...newDate, day: 1, month: (date.month % 12) + 1 };
              if (newDate.month === 1) newDate.year += 1;
            } else {
              newDate.day += 1;
            }
          } else {
            if (date[field] === 1) {
              newDate.month -= 1;
              if (newDate.month === 0) {
                newDate.month = 12;
                newDate.year -= 1;
              }
              newDate.day = new Date(newDate.year, newDate.month, 0).getDate();
            } else {
              newDate.day -= 1;
            }
          }
        }

        if (field === "month") {
          if (e.key === "ArrowUp") {
            if (date[field] === 12) {
              newDate = { ...newDate, month: 1, year: date.year + 1 };
            } else {
              newDate.month += 1;
            }
          } else {
            if (date[field] === 1) {
              newDate = { ...newDate, month: 12, year: date.year - 1 };
            } else {
              newDate.month -= 1;
            }
          }
        }

        if (field === "year") {
          newDate.year += e.key === "ArrowUp" ? 1 : -1;
        }

        setDate(newDate);
        onChange(new Date(newDate.year, newDate.month - 1, newDate.day));
      }

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const isAtExtreme =
          (e.key === "ArrowRight" &&
            (e.currentTarget.selectionStart === e.currentTarget.value.length ||
              (e.currentTarget.selectionStart === 0 &&
                e.currentTarget.selectionEnd ===
                  e.currentTarget.value.length))) ||
          (e.key === "ArrowLeft" &&
            (e.currentTarget.selectionStart === 0 ||
              (e.currentTarget.selectionStart === 0 &&
                e.currentTarget.selectionEnd ===
                  e.currentTarget.value.length)));

        if (isAtExtreme) {
          e.preventDefault();
          if (field === "month" && e.key === "ArrowRight")
            dayRef.current?.focus();
          if (field === "day" && e.key === "ArrowRight")
            yearRef.current?.focus();
          if (field === "day" && e.key === "ArrowLeft")
            monthRef.current?.focus();
          if (field === "year" && e.key === "ArrowLeft")
            dayRef.current?.focus();
        }
      }
    };

  return (
    <div className="flex items-center rounded-lg border px-1 text-sm">
      <input
        type="text"
        ref={monthRef}
        max={12}
        maxLength={2}
        value={date.month.toString()}
        onChange={handleInputChange("month")}
        onKeyDown={handleKeyDown("month")}
        onFocus={(e) => {
          if (window.innerWidth > 1024) {
            e.target.select();
          }
        }}
        onBlur={handleBlur("month")}
        className="w-6 border-none p-0 text-center outline-none"
        placeholder="M"
      />
      <span className="-mx-px opacity-20">/</span>
      <input
        type="text"
        ref={dayRef}
        max={31}
        maxLength={2}
        value={date.day.toString()}
        onChange={handleInputChange("day")}
        onKeyDown={handleKeyDown("day")}
        onFocus={(e) => {
          if (window.innerWidth > 1024) {
            e.target.select();
          }
        }}
        onBlur={handleBlur("day")}
        className="w-7 border-none p-0 text-center outline-none"
        placeholder="D"
      />
      <span className="-mx-px opacity-20">/</span>
      <input
        type="text"
        ref={yearRef}
        max={9999}
        maxLength={4}
        value={date.year.toString()}
        onChange={handleInputChange("year")}
        onKeyDown={handleKeyDown("year")}
        onFocus={(e) => {
          if (window.innerWidth > 1024) {
            e.target.select();
          }
        }}
        onBlur={handleBlur("year")}
        className="w-12 border-none p-0 text-center outline-none"
        placeholder="YYYY"
      />
    </div>
  );
};

DateInput.displayName = "DateInput";

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

// Icon size mapping for variants
const iconSizeMap = {
  sm: 14,
  default: 18,
  lg: 24,
} as const;

// Calendar months mapping for variants
const calendarMonthsMap = {
  sm: 1,
  default: 2,
  lg: 2,
} as const;

export interface DateRangePickerProps extends VariantProps<
  typeof dateRangePickerVariants
> {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void;
  /** Initial value for start date */
  initialDateFrom?: Date | string;
  /** Initial value for end date */
  initialDateTo?: Date | string;
  /** Initial value for start date for compare */
  initialCompareFrom?: Date | string;
  /** Initial value for end date for compare */
  initialCompareTo?: Date | string;
  /** Alignment of popover */
  align?: "start" | "center" | "end";
  /** Option for locale */
  locale?: string;
  /** Option for showing compare feature */
  showCompare?: boolean;
}

const formatDate = (date: Date, locale: string = "en-us"): string => {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === "string") {
    const parts = dateInput.split("-").map(Number);
    const year = parts[0] ?? new Date().getFullYear();
    const month = parts[1] ?? 1;
    const day = parts[2] ?? 1;
    return new Date(year, month - 1, day);
  }
  return dateInput;
};

interface DateRange {
  from: Date;
  to: Date | undefined;
}

interface Preset {
  name: string;
  label: string;
}

const PRESETS: Preset[] = [
  { name: "today", label: "Today" },
  { name: "yesterday", label: "Yesterday" },
  { name: "last7", label: "Last 7 days" },
  { name: "last14", label: "Last 14 days" },
  { name: "last30", label: "Last 30 days" },
  { name: "thisWeek", label: "This Week" },
  { name: "lastWeek", label: "Last Week" },
  { name: "thisMonth", label: "This Month" },
  { name: "lastMonth", label: "Last Month" },
];

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> = ({
  initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
  initialDateTo,
  initialCompareFrom,
  initialCompareTo,
  onUpdate,
  align = "end",
  locale = "en-US",
  showCompare = true,
  size = "default",
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const [range, setRange] = useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo
      ? getDateAdjustedForTimezone(initialDateTo)
      : getDateAdjustedForTimezone(initialDateFrom),
  });
  const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
    initialCompareFrom
      ? {
          from: getDateAdjustedForTimezone(initialCompareFrom),
          to: initialCompareTo
            ? getDateAdjustedForTimezone(initialCompareTo)
            : getDateAdjustedForTimezone(initialCompareFrom),
        }
      : undefined,
  );

  const openedRangeRef = useRef<DateRange | undefined>(undefined);
  const openedRangeCompareRef = useRef<DateRange | undefined>(undefined);

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    undefined,
  );

  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 960 : false,
  );

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmallScreen(window.innerWidth < 960);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getPresetRange = (presetName: string): DateRange => {
    const preset = PRESETS.find(({ name }) => name === presetName);
    if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);
    const from = new Date();
    const to = new Date();
    const first = from.getDate() - from.getDay();

    switch (preset.name) {
      case "today":
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "yesterday":
        from.setDate(from.getDate() - 1);
        from.setHours(0, 0, 0, 0);
        to.setDate(to.getDate() - 1);
        to.setHours(23, 59, 59, 999);
        break;
      case "last7":
        from.setDate(from.getDate() - 6);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "last14":
        from.setDate(from.getDate() - 13);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "last30":
        from.setDate(from.getDate() - 29);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "thisWeek":
        from.setDate(first);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "lastWeek":
        from.setDate(from.getDate() - 7 - from.getDay());
        to.setDate(to.getDate() - to.getDay() - 1);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "thisMonth":
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "lastMonth":
        from.setMonth(from.getMonth() - 1);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setDate(0);
        to.setHours(23, 59, 59, 999);
        break;
    }

    return { from, to };
  };

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset);
    setRange(range);
    if (rangeCompare) {
      const rangeCompare = {
        from: new Date(
          range.from.getFullYear() - 1,
          range.from.getMonth(),
          range.from.getDate(),
        ),
        to: range.to
          ? new Date(
              range.to.getFullYear() - 1,
              range.to.getMonth(),
              range.to.getDate(),
            )
          : new Date(
              range.from.getFullYear() - 1,
              range.from.getMonth(),
              range.from.getDate(),
            ),
      };
      setRangeCompare(rangeCompare);
    }
  };

  const checkPreset = (): void => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name);

      const normalizedRangeFrom = new Date(range.from);
      normalizedRangeFrom.setHours(0, 0, 0, 0);
      const normalizedPresetFrom = new Date(
        presetRange.from.setHours(0, 0, 0, 0),
      );

      const normalizedRangeTo = new Date(range.to ?? 0);
      normalizedRangeTo.setHours(0, 0, 0, 0);
      const normalizedPresetTo = new Date(
        presetRange.to?.setHours(0, 0, 0, 0) ?? 0,
      );

      if (
        normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
        normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
      ) {
        setSelectedPreset(preset.name);
        return;
      }
    }

    setSelectedPreset(undefined);
  };

  const resetValues = (): void => {
    setRange({
      from: getDateAdjustedForTimezone(initialDateFrom),
      to: initialDateTo
        ? getDateAdjustedForTimezone(initialDateTo)
        : getDateAdjustedForTimezone(initialDateFrom),
    });
    setRangeCompare(
      initialCompareFrom
        ? {
            from: getDateAdjustedForTimezone(initialCompareFrom),
            to: initialCompareTo
              ? getDateAdjustedForTimezone(initialCompareTo)
              : getDateAdjustedForTimezone(initialCompareFrom),
          }
        : undefined,
    );
  };

  useEffect(() => {
    checkPreset();
  }, [range]);

  const PresetButton: FC<{
    preset: string;
    label: string;
    isSelected: boolean;
  }> = ({ preset, label, isSelected }) => (
    <Button
      className={cn(isSelected && "pointer-events-none")}
      variant="ghost"
      size={size}
      onClick={() => {
        setPreset(preset);
      }}
    >
      <>
        <span className={cn("pr-2 opacity-0", isSelected && "opacity-70")}>
          <CheckIcon
            width={size === "sm" ? 14 : 18}
            height={size === "sm" ? 14 : 18}
          />
        </span>
        {label}
      </>
    </Button>
  );

  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b;
    return (
      a.from.getTime() === b.from.getTime() &&
      (!a.to || !b.to || a.to.getTime() === b.to.getTime())
    );
  };

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range;
      openedRangeCompareRef.current = rangeCompare;
    }
  }, [isOpen]);

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues();
        }
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button size={size} variant="outline">
          <div className="text-right">
            <div className={cn("py-1", size === "sm" && "py-0.5")}>
              <div
                className={cn(dateRangePickerVariants({ size }))}
              >{`${formatDate(range.from, locale)}${
                range.to != null ? " - " + formatDate(range.to, locale) : ""
              }`}</div>
            </div>
            {rangeCompare != null && (
              <div
                className={cn(
                  "-mt-1 opacity-60",
                  size === "sm" ? "text-[10px]" : "text-xs",
                )}
              >
                <>
                  vs. {formatDate(rangeCompare.from, locale)}
                  {rangeCompare.to != null
                    ? ` - ${formatDate(rangeCompare.to, locale)}`
                    : ""}
                </>
              </div>
            )}
          </div>
          <div
            className={cn(
              "-mr-2 pl-1 opacity-60",
              size === "sm" ? "scale-100" : "scale-125",
            )}
          >
            {isOpen ? (
              <ChevronUpIcon width={iconSizeMap[size || "default"]} />
            ) : (
              <ChevronDownIcon width={iconSizeMap[size || "default"]} />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn("w-auto", size === "sm" && "p-2")}
        data-size={size}
      >
        <div className={cn("flex", size === "sm" ? "py-1" : "py-2")}>
          <div className="flex">
            <div className="flex flex-col">
              <div
                className={cn(
                  "flex flex-col items-center justify-end gap-2 pb-4 lg:flex-row lg:items-start lg:pb-0",
                  size === "sm" ? "px-2 pb-2 lg:pb-0" : "px-3",
                )}
              >
                {showCompare && (
                  <div
                    className={cn(
                      "flex items-center space-x-2 py-1",
                      size === "sm" ? "pr-2" : "pr-4",
                    )}
                  >
                    <Switch
                      defaultChecked={Boolean(rangeCompare)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          if (!range.to) {
                            setRange({
                              from: range.from,
                              to: range.from,
                            });
                          }
                          setRangeCompare({
                            from: new Date(
                              range.from.getFullYear(),
                              range.from.getMonth(),
                              range.from.getDate() - 365,
                            ),
                            to: range.to
                              ? new Date(
                                  range.to.getFullYear() - 1,
                                  range.to.getMonth(),
                                  range.to.getDate(),
                                )
                              : new Date(
                                  range.from.getFullYear() - 1,
                                  range.from.getMonth(),
                                  range.from.getDate(),
                                ),
                          });
                        } else {
                          setRangeCompare(undefined);
                        }
                      }}
                      id="compare-mode"
                    />
                    <Label
                      htmlFor="compare-mode"
                      className={cn(size === "sm" && "text-xs")}
                    >
                      Compare
                    </Label>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <DateInput
                      value={range.from}
                      onChange={(date) => {
                        const toDate =
                          range.to == null || date > range.to ? date : range.to;
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: date,
                          to: toDate,
                        }));
                      }}
                    />
                    <div className="py-1">-</div>
                    <DateInput
                      value={range.to}
                      onChange={(date) => {
                        const fromDate = date < range.from ? date : range.from;
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: fromDate,
                          to: date,
                        }));
                      }}
                    />
                  </div>
                  {rangeCompare != null && (
                    <div className="flex gap-2">
                      <DateInput
                        value={rangeCompare?.from}
                        onChange={(date) => {
                          if (rangeCompare) {
                            const compareToDate =
                              rangeCompare.to == null || date > rangeCompare.to
                                ? date
                                : rangeCompare.to;
                            setRangeCompare((prevRangeCompare) => ({
                              ...prevRangeCompare,
                              from: date,
                              to: compareToDate,
                            }));
                          } else {
                            setRangeCompare({
                              from: date,
                              to: new Date(),
                            });
                          }
                        }}
                      />
                      <div className="py-1">-</div>
                      <DateInput
                        value={rangeCompare?.to}
                        onChange={(date) => {
                          if (rangeCompare && rangeCompare.from) {
                            const compareFromDate =
                              date < rangeCompare.from
                                ? date
                                : rangeCompare.from;
                            setRangeCompare({
                              ...rangeCompare,
                              from: compareFromDate,
                              to: date,
                            });
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {isSmallScreen && (
                <Select
                  defaultValue={selectedPreset}
                  onValueChange={(value) => {
                    setPreset(value);
                  }}
                >
                  <SelectTrigger className="mx-auto mb-2 w-[180px]">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div>
                <Calendar
                  mode="range"
                  onSelect={(value: { from?: Date; to?: Date } | undefined) => {
                    if (value?.from != null) {
                      setRange({ from: value.from, to: value?.to });
                    }
                  }}
                  selected={range}
                  numberOfMonths={
                    isSmallScreen ? 1 : calendarMonthsMap[size || "default"]
                  }
                  defaultMonth={
                    new Date(
                      new Date().setMonth(
                        new Date().getMonth() -
                          (isSmallScreen
                            ? 0
                            : calendarMonthsMap[size || "default"] === 2
                              ? 1
                              : 0),
                      ),
                    )
                  }
                  className={cn(size === "sm" && "text-xs")}
                />
              </div>
            </div>
          </div>
          {!isSmallScreen && (
            <div
              className={cn(
                "flex flex-col items-end gap-1 pb-6 pr-2",
                size === "sm" ? "pl-4" : "pl-6",
              )}
            >
              <div
                className={cn(
                  "flex w-full flex-col items-end gap-1 pb-6 pr-2",
                  size === "sm" ? "pl-4" : "pl-6",
                )}
              >
                {PRESETS.map((preset) => (
                  <PresetButton
                    key={preset.name}
                    preset={preset.name}
                    label={preset.label}
                    isSelected={selectedPreset === preset.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex justify-end gap-2 pr-4",
            size === "sm" ? "py-1" : "py-2",
          )}
        >
          <Button
            onClick={() => {
              setIsOpen(false);
              resetValues();
            }}
            variant="ghost"
            size={size}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              if (
                !areRangesEqual(range, openedRangeRef.current) ||
                !areRangesEqual(rangeCompare, openedRangeCompareRef.current)
              ) {
                onUpdate?.({ range, rangeCompare });
              }
            }}
            size={size}
          >
            Update
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

DateRangePicker.displayName = "DateRangePicker";
