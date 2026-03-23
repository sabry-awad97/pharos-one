/**
 * DataTableFilters Component
 * Unified multi-column filter interface with Windows Fluent Design aesthetic
 *
 * ARCHITECTURE: Composable filter panel
 * - Supports multiple columns in one interface
 * - Windows-inspired professional design
 * - Smooth interactions and clear hierarchy
 *
 * USAGE:
 * ```typescript
 * <DataTableFilters
 *   filters={[
 *     { column: statusColumn, options: statusOptions, title: "Status" },
 *     { column: categoryColumn, options: categoryOptions, title: "Category" }
 *   ]}
 * />
 * ```
 */

import * as React from "react";
import type { Column } from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@pharos-one/ui/components/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@pharos-one/ui/components/command";
import { Badge } from "@pharos-one/ui/components/badge";
import { cn } from "@pharos-one/ui/lib/utils";
import { CheckIcon, XIcon } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ColumnFilter<TData, TValue = unknown> {
  column: Column<TData, TValue>;
  options: FilterOption[];
  title: string;
}

export interface DataTableFiltersProps<TData> {
  filters: ColumnFilter<TData, any>[];
  align?: "start" | "center" | "end";
}

/**
 * Unified multi-column filter component
 * Windows Fluent Design aesthetic with professional polish
 */
export function DataTableFilters<TData>({
  filters,
  align = "start",
}: DataTableFiltersProps<TData>) {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Calculate total active filters across all columns
  const totalActiveFilters = React.useMemo(() => {
    return filters.reduce((total, filter) => {
      const filterValue = filter.column.getFilterValue() as
        | string[]
        | undefined;
      return total + (filterValue?.length || 0);
    }, 0);
  }, [filters]);

  // Clear all filters
  const clearAllFilters = React.useCallback(() => {
    filters.forEach((filter) => {
      filter.column.setFilterValue(undefined);
    });
  }, [filters]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          title="Filter"
          className="flex items-center gap-1 h-[26px] px-2 rounded border border-transparent text-muted-foreground hover:bg-muted hover:border-border transition-colors text-[11px]"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>Filter</span>
          {totalActiveFilters > 0 && (
            <Badge
              variant="secondary"
              className="ml-0.5 h-4 min-w-4 px-1 text-[10px] font-semibold bg-primary text-primary-foreground"
            >
              {totalActiveFilters}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0 border-border shadow-lg"
        align={align}
      >
        <div className="flex flex-col max-h-[420px]">
          {/* Header */}
          <div className="flex-none px-3 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-foreground">
                Filter Data
              </h3>
              {totalActiveFilters > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <XIcon className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>
            {totalActiveFilters > 0 && (
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {totalActiveFilters} filter{totalActiveFilters !== 1 ? "s" : ""}{" "}
                active
              </p>
            )}
          </div>

          {/* Search */}
          <div className="flex-none px-2 py-1.5 border-b border-border">
            <Command className="border-none shadow-none">
              <CommandInput
                placeholder="Search filters..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="h-7 text-[11px]"
              />
            </Command>
          </div>

          {/* Filter Sections */}
          <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
            <Command className="border-none shadow-none">
              <CommandList>
                <CommandEmpty className="py-4 text-center text-[11px] text-muted-foreground">
                  No filters found.
                </CommandEmpty>
                {filters.map((filter, index) => (
                  <FilterSection
                    key={filter.title}
                    filter={filter}
                    searchQuery={searchQuery}
                    isLast={index === filters.length - 1}
                  />
                ))}
              </CommandList>
            </Command>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Individual filter section for a column
 */
function FilterSection<TData, TValue>({
  filter,
  searchQuery,
  isLast,
}: {
  filter: ColumnFilter<TData, TValue>;
  searchQuery: string;
  isLast: boolean;
}) {
  const { column, options, title } = filter;
  const facets = column.getFacetedUniqueValues();
  const selectedValues = new Set(column.getFilterValue() as string[]);

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [options, searchQuery]);

  if (filteredOptions.length === 0) return null;

  return (
    <>
      <CommandGroup
        heading={
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </span>
            {selectedValues.size > 0 && (
              <Badge
                variant="secondary"
                className="h-3.5 px-1 text-[9px] font-medium bg-primary/10 text-primary border-primary/20"
              >
                {selectedValues.size}
              </Badge>
            )}
          </div>
        }
      >
        {filteredOptions.map(({ label, value, icon: Icon }) => {
          const isSelected = selectedValues.has(value);
          const count = facets.get(value);

          return (
            <CommandItem
              key={value}
              onSelect={() => {
                if (isSelected) {
                  selectedValues.delete(value);
                } else {
                  selectedValues.add(value);
                }
                const filterValues = Array.from(selectedValues);
                column.setFilterValue(
                  filterValues.length ? filterValues : undefined,
                );
              }}
              className="group px-2 py-1.5 cursor-pointer"
            >
              <div
                className={cn(
                  "mr-1.5 flex h-3.5 w-3.5 items-center justify-center rounded border transition-colors",
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border group-hover:border-primary/50",
                )}
              >
                <CheckIcon
                  className={cn(
                    "h-2.5 w-2.5 transition-opacity",
                    isSelected ? "opacity-100" : "opacity-0",
                  )}
                />
              </div>
              {Icon && (
                <Icon className="mr-1.5 h-3 w-3 text-muted-foreground" />
              )}
              <span className="flex-1 text-[11px] text-foreground">
                {label}
              </span>
              {count !== undefined && count > 0 && (
                <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                  {count}
                </span>
              )}
            </CommandItem>
          );
        })}
      </CommandGroup>
      {!isLast && <CommandSeparator className="my-0.5" />}
    </>
  );
}
