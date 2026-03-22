import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronDown,
  Calendar,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Helper functions
const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();
const formatDateInput = (date: Date | null) => {
  if (!date) return "";
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};
const formatDisplayDate = (date: Date | null) => {
  if (!date) return "";
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

const isSameDay = (d1: Date | null, d2: Date | null) => {
  if (!d1 || !d2) return false;
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

const getPreviousPeriod = (
  start: Date | null,
  end: Date | null,
): [Date | null, Date | null] => {
  if (!start || !end) return [null, null];
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const newEnd = new Date(start);
  newEnd.setDate(newEnd.getDate() - 1);
  const newStart = new Date(newEnd);
  newStart.setDate(newStart.getDate() - diffDays);
  return [newStart, newEnd];
};

const getPreviousYear = (
  start: Date | null,
  end: Date | null,
): [Date | null, Date | null] => {
  if (!start || !end) return [null, null];
  const newStart = new Date(start);
  newStart.setFullYear(newStart.getFullYear() - 1);
  const newEnd = new Date(end);
  newEnd.setFullYear(newEnd.getFullYear() - 1);
  return [newStart, newEnd];
};

const PRESETS = [
  { label: "Today", getValue: () => [new Date(), new Date()] },
  {
    label: "Yesterday",
    getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return [d, d];
    },
  },
  {
    label: "Last 7 days",
    getValue: () => {
      const d = new Date();
      const start = new Date();
      start.setDate(d.getDate() - 6);
      return [start, d];
    },
  },
  {
    label: "Last 14 days",
    getValue: () => {
      const d = new Date();
      const start = new Date();
      start.setDate(d.getDate() - 13);
      return [start, d];
    },
  },
  {
    label: "Last 30 days",
    getValue: () => {
      const d = new Date();
      const start = new Date();
      start.setDate(d.getDate() - 29);
      return [start, d];
    },
  },
  {
    label: "This Week",
    getValue: () => {
      const d = new Date();
      const day = d.getDay();
      const start = new Date(d);
      start.setDate(d.getDate() - day);
      return [start, d];
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
      return [start, end];
    },
  },
  {
    label: "This Month",
    getValue: () => {
      const d = new Date();
      return [new Date(d.getFullYear(), d.getMonth(), 1), d];
    },
  },
  {
    label: "Last Month",
    getValue: () => {
      const d = new Date();
      const start = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      const end = new Date(d.getFullYear(), d.getMonth(), 0);
      return [start, end];
    },
  },
];

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  compareStartDate?: Date;
  compareEndDate?: Date;
  isComparing?: boolean;
  onChange?: (range: {
    startDate: Date;
    endDate: Date;
    compareStartDate?: Date;
    compareEndDate?: Date;
    isComparing: boolean;
  }) => void;
}

export default function DateRangePicker({
  startDate: initialStart,
  endDate: initialEnd,
  compareStartDate: initialCompStart,
  compareEndDate: initialCompEnd,
  isComparing: initialIsComparing = false,
  onChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Default to today if no initial dates provided
  const defaultDate = new Date();
  const [startDate, setStartDate] = useState<Date | null>(
    initialStart || defaultDate,
  );
  const [endDate, setEndDate] = useState<Date | null>(
    initialEnd || defaultDate,
  );
  const [compareStart, setCompareStart] = useState<Date | null>(
    initialCompStart || null,
  );
  const [compareEnd, setCompareEnd] = useState<Date | null>(
    initialCompEnd || null,
  );
  const [isCompareActive, setIsCompareActive] = useState(initialIsComparing);

  // Temporary state for the picker before "Apply" is clicked
  const [tempStart, setTempStart] = useState<Date | null>(startDate);
  const [tempEnd, setTempEnd] = useState<Date | null>(endDate);
  const [tempCompareStart, setTempCompareStart] = useState<Date | null>(
    compareStart,
  );
  const [tempCompareEnd, setTempCompareEnd] = useState<Date | null>(compareEnd);
  const [tempIsCompare, setTempIsCompare] = useState(isCompareActive);

  const [activePreset, setActivePreset] = useState<string>("Today");
  const [compareMode, setCompareMode] = useState<
    "previous_period" | "previous_year" | "custom"
  >("previous_period");
  const [editingRange, setEditingRange] = useState<"primary" | "compare">(
    "primary",
  );

  // Calendar view state (which months are visible)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync temp state when opening
  useEffect(() => {
    if (isOpen) {
      setTempStart(startDate);
      setTempEnd(endDate);
      setTempCompareStart(compareStart);
      setTempCompareEnd(compareEnd);
      setTempIsCompare(isCompareActive);
      setEditingRange("primary");
      if (endDate) {
        setCurrentMonth(endDate.getMonth());
        setCurrentYear(endDate.getFullYear());
      }
    }
  }, [isOpen, startDate, endDate, compareStart, compareEnd, isCompareActive]);

  // Auto-calculate compare dates when primary dates or compare mode changes
  useEffect(() => {
    if (tempIsCompare && tempStart && tempEnd && compareMode !== "custom") {
      if (compareMode === "previous_period") {
        const [s, e] = getPreviousPeriod(tempStart, tempEnd);
        setTempCompareStart(s);
        setTempCompareEnd(e);
      } else if (compareMode === "previous_year") {
        const [s, e] = getPreviousYear(tempStart, tempEnd);
        setTempCompareStart(s);
        setTempCompareEnd(e);
      }
    }
  }, [tempStart, tempEnd, tempIsCompare, compareMode]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (date: Date) => {
    if (editingRange === "primary") {
      if ((tempStart && tempEnd) || (!tempStart && !tempEnd)) {
        setTempStart(date);
        setTempEnd(null);
        setActivePreset("");
      } else if (tempStart && !tempEnd) {
        if (date < tempStart) {
          setTempEnd(tempStart);
          setTempStart(date);
        } else {
          setTempEnd(date);
        }
        setActivePreset("");
      }
    } else {
      // Editing compare range
      setCompareMode("custom");
      if (
        (tempCompareStart && tempCompareEnd) ||
        (!tempCompareStart && !tempCompareEnd)
      ) {
        setTempCompareStart(date);
        setTempCompareEnd(null);
      } else if (tempCompareStart && !tempCompareEnd) {
        if (date < tempCompareStart) {
          setTempCompareEnd(tempCompareStart);
          setTempCompareStart(date);
        } else {
          setTempCompareEnd(date);
        }
      }
    }
  };

  const handlePresetClick = (preset: (typeof PRESETS)[0]) => {
    const [start, end] = preset.getValue();
    setTempStart(start);
    setTempEnd(end);
    setActivePreset(preset.label);
    setCurrentMonth(end.getMonth());
    setCurrentYear(end.getFullYear());
    setEditingRange("primary");
  };

  const handleToggleCompare = () => {
    const newVal = !tempIsCompare;
    setTempIsCompare(newVal);
    if (!newVal) {
      setEditingRange("primary");
    } else if (!tempCompareStart || !tempCompareEnd) {
      setCompareMode("previous_period");
    }
  };

  const handleUpdate = () => {
    if (tempStart && tempEnd) {
      setStartDate(tempStart);
      setEndDate(tempEnd);
      setCompareStart(tempCompareStart);
      setCompareEnd(tempCompareEnd);
      setIsCompareActive(tempIsCompare);

      if (onChange) {
        onChange({
          startDate: tempStart,
          endDate: tempEnd,
          compareStartDate: tempIsCompare
            ? tempCompareStart || undefined
            : undefined,
          compareEndDate: tempIsCompare
            ? tempCompareEnd || undefined
            : undefined,
          isComparing: tempIsCompare,
        });
      }
      setIsOpen(false);
    }
  };

  const renderCalendar = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Previous month's trailing days
    const prevMonthDays = getDaysInMonth(
      month === 0 ? year - 1 : year,
      month === 0 ? 11 : month - 1,
    );
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="w-8 h-8 flex items-center justify-center text-xs text-zinc-300 dark:text-zinc-600"
        >
          {prevMonthDays - firstDay + i + 1}
        </div>,
      );
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);

      // Primary Range Logic
      const isPrimaryStart = isSameDay(date, tempStart);
      const isPrimaryEnd = isSameDay(date, tempEnd);
      const isPrimarySelected = isPrimaryStart || isPrimaryEnd;
      const inPrimaryRange =
        tempStart && tempEnd && date > tempStart && date < tempEnd;

      // Compare Range Logic
      const isCompStart = tempIsCompare && isSameDay(date, tempCompareStart);
      const isCompEnd = tempIsCompare && isSameDay(date, tempCompareEnd);
      const isCompSelected = isCompStart || isCompEnd;
      const inCompRange =
        tempIsCompare &&
        tempCompareStart &&
        tempCompareEnd &&
        date > tempCompareStart &&
        date < tempCompareEnd;

      const isToday = isSameDay(date, new Date());

      let wrapperClass = "w-8 h-8 flex items-center justify-center relative ";

      // Background for ranges
      if (inPrimaryRange && inCompRange) {
        wrapperClass +=
          "bg-gradient-to-b from-indigo-500/20 to-amber-500/20 dark:from-indigo-500/30 dark:to-amber-500/30 ";
      } else if (inPrimaryRange) {
        wrapperClass += "bg-indigo-50 dark:bg-indigo-500/20 ";
      } else if (inCompRange) {
        wrapperClass += "bg-amber-50 dark:bg-amber-500/20 ";
      }

      // Handle rounded corners for range ends
      if (tempStart && tempEnd && !inCompRange) {
        if (isPrimaryStart && date < tempEnd) wrapperClass += "rounded-l-md ";
        if (isPrimaryEnd && date > tempStart) wrapperClass += "rounded-r-md ";
      }
      if (
        tempIsCompare &&
        tempCompareStart &&
        tempCompareEnd &&
        !inPrimaryRange
      ) {
        if (isCompStart && date < tempCompareEnd)
          wrapperClass += "rounded-l-md ";
        if (isCompEnd && date > tempCompareStart)
          wrapperClass += "rounded-r-md ";
      }

      let innerClass =
        "w-full h-full flex items-center justify-center text-xs cursor-pointer transition-all duration-200 ";

      if (isPrimarySelected && isCompSelected) {
        innerClass +=
          "bg-gradient-to-br from-indigo-600 to-amber-500 text-white rounded-md font-medium shadow-sm z-10";
      } else if (isPrimarySelected) {
        innerClass +=
          "bg-indigo-600 text-white rounded-md font-medium shadow-sm shadow-indigo-500/30 z-10";
      } else if (isCompSelected) {
        innerClass +=
          "bg-amber-500 text-white rounded-md font-medium shadow-sm shadow-amber-500/30 z-10";
      } else {
        innerClass +=
          "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 rounded-md";
        if (isToday)
          innerClass += " font-bold text-indigo-600 dark:text-indigo-400";
      }

      days.push(
        <div key={i} className={wrapperClass}>
          <div className={innerClass} onClick={() => handleDayClick(date)}>
            {i}
          </div>
        </div>,
      );
    }

    // Next month's leading days to fill the grid
    const totalCells = days.length;
    const remainingCells = 42 - totalCells; // 6 rows of 7 days
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className="w-8 h-8 flex items-center justify-center text-xs text-zinc-300 dark:text-zinc-600"
        >
          {i}
        </div>,
      );
    }

    const monthName = new Date(year, month).toLocaleString("default", {
      month: "long",
    });

    return (
      <div className="flex flex-col w-[224px]">
        <div className="flex justify-center items-center mb-3">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
            {monthName} {year}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-y-1 mb-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="w-8 text-center text-[10px] text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">{days}</div>
      </div>
    );
  };

  // Calculate the previous month for the left calendar
  const leftMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const leftYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  return (
    <div className="relative inline-block text-left font-sans" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-white/80 dark:hover:bg-zinc-700/80 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
        <div className="flex flex-col items-start text-left">
          <span>
            {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
          </span>
          {isCompareActive && compareStart && compareEnd && (
            <span className="text-[10px] text-amber-600 dark:text-amber-500 leading-none mt-0.5 font-semibold">
              vs {formatDisplayDate(compareStart)} -{" "}
              {formatDisplayDate(compareEnd)}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ml-1 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-700/50 rounded-xl shadow-2xl z-50 flex flex-col w-[640px] overflow-hidden ring-1 ring-black/5 dark:ring-white/5"
          >
            {/* Top Bar - Primary & Compare Controls */}
            <div className="flex flex-col border-b border-zinc-200/50 dark:border-zinc-700/50 bg-white/40 dark:bg-zinc-800/40">
              {/* Row 1: Primary Range */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <button
                    className={`w-8 h-4 rounded-full transition-colors duration-300 relative focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${tempIsCompare ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-600"}`}
                    onClick={handleToggleCompare}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-300 shadow-sm ${tempIsCompare ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </button>
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Compare
                  </span>
                </div>

                <div
                  onClick={() => setEditingRange("primary")}
                  className={`flex items-center p-1 rounded-lg border transition-all duration-300 cursor-pointer ${
                    editingRange === "primary"
                      ? "bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-500/30"
                      : "bg-zinc-100/50 dark:bg-zinc-800/50 border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${tempStart && editingRange === "primary" ? "bg-white dark:bg-zinc-900 shadow-sm text-indigo-700 dark:text-indigo-300" : "text-zinc-600 dark:text-zinc-400"}`}
                  >
                    <CalendarDays
                      className={`w-3.5 h-3.5 ${tempStart && editingRange === "primary" ? "text-indigo-500" : "text-zinc-400"}`}
                    />
                    <span className="w-24 text-center">
                      {formatDisplayDate(tempStart) || "Start Date"}
                    </span>
                  </div>
                  <div className="px-1 text-zinc-400 dark:text-zinc-500">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${tempEnd && editingRange === "primary" ? "bg-white dark:bg-zinc-900 shadow-sm text-indigo-700 dark:text-indigo-300" : "text-zinc-600 dark:text-zinc-400"}`}
                  >
                    <CalendarDays
                      className={`w-3.5 h-3.5 ${tempEnd && editingRange === "primary" ? "text-indigo-500" : "text-zinc-400"}`}
                    />
                    <span className="w-24 text-center">
                      {formatDisplayDate(tempEnd) || "End Date"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Compare Range (Animated) */}
              <AnimatePresence>
                {tempIsCompare && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden border-t border-zinc-200/50 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-900/30"
                  >
                    <div className="flex items-center justify-between px-4 py-3">
                      {/* Compare Mode Selectors */}
                      <div className="flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50">
                        <button
                          onClick={() => setCompareMode("previous_period")}
                          className={`px-2.5 py-1.5 text-[10px] font-medium rounded-md transition-all ${compareMode === "previous_period" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-800 dark:text-zinc-200" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                        >
                          Previous Period
                        </button>
                        <button
                          onClick={() => setCompareMode("previous_year")}
                          className={`px-2.5 py-1.5 text-[10px] font-medium rounded-md transition-all ${compareMode === "previous_year" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-800 dark:text-zinc-200" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                        >
                          Previous Year
                        </button>
                        <button
                          onClick={() => {
                            setCompareMode("custom");
                            setEditingRange("compare");
                          }}
                          className={`px-2.5 py-1.5 text-[10px] font-medium rounded-md transition-all ${compareMode === "custom" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-800 dark:text-zinc-200" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                        >
                          Custom
                        </button>
                      </div>

                      {/* Compare Pill */}
                      <div
                        onClick={() => {
                          setEditingRange("compare");
                          setCompareMode("custom");
                        }}
                        className={`flex items-center p-1 rounded-lg border transition-all duration-300 cursor-pointer ${
                          editingRange === "compare"
                            ? "bg-amber-50/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 ring-1 ring-amber-500/30"
                            : "bg-zinc-100/50 dark:bg-zinc-800/50 border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${tempCompareStart && editingRange === "compare" ? "bg-white dark:bg-zinc-900 shadow-sm text-amber-700 dark:text-amber-500" : "text-zinc-600 dark:text-zinc-400"}`}
                        >
                          <CalendarDays
                            className={`w-3.5 h-3.5 ${tempCompareStart && editingRange === "compare" ? "text-amber-500" : "text-zinc-400"}`}
                          />
                          <span className="w-24 text-center">
                            {formatDisplayDate(tempCompareStart) ||
                              "Start Date"}
                          </span>
                        </div>
                        <div className="px-1 text-zinc-400 dark:text-zinc-500">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${tempCompareEnd && editingRange === "compare" ? "bg-white dark:bg-zinc-900 shadow-sm text-amber-700 dark:text-amber-500" : "text-zinc-600 dark:text-zinc-400"}`}
                        >
                          <CalendarDays
                            className={`w-3.5 h-3.5 ${tempCompareEnd && editingRange === "compare" ? "text-amber-500" : "text-zinc-400"}`}
                          />
                          <span className="w-24 text-center">
                            {formatDisplayDate(tempCompareEnd) || "End Date"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-row-reverse">
              {/* Calendars Area */}
              <div className="flex-1 p-5 flex gap-6 relative justify-center">
                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevMonth}
                  className="absolute left-5 top-5 p-1.5 rounded-md hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 text-zinc-500 dark:text-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="absolute right-5 top-5 p-1.5 rounded-md hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 text-zinc-500 dark:text-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {renderCalendar(leftYear, leftMonth)}
                {renderCalendar(currentYear, currentMonth)}
              </div>

              {/* Left Sidebar - Presets */}
              <div className="w-36 border-r border-zinc-200/50 dark:border-zinc-700/50 py-3 flex flex-col bg-zinc-50/50 dark:bg-zinc-800/20 gap-0.5 px-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset)}
                    className={`flex items-center justify-between px-3 py-2 text-xs text-left w-full rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                      activePreset === preset.label
                        ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium shadow-sm"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    <span>{preset.label}</span>
                    {activePreset === preset.label && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200/50 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-800/20">
              <div className="flex items-center gap-2">
                {/* Legend */}
                {tempIsCompare && (
                  <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>{" "}
                      Primary
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>{" "}
                      Compare
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-zinc-100 px-4 py-2 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-md transition-all shadow-sm shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-95"
                >
                  Apply Range
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
