import type { Column } from "@tanstack/react-table";
import { Badge } from "@pharos-one/ui/components/badge";
import { Button } from "@pharos-one/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@pharos-one/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@pharos-one/ui/components/popover";
import { Separator } from "@pharos-one/ui/components/separator";
import { cn } from "@pharos-one/ui/lib/utils";
import { CheckIcon, PlusCircleIcon } from "lucide-react";

function titleCase(str: string): string {
  return str
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  title?: string;
  customTrigger?: React.ReactNode;
}

function DataTableFacetedFilter<TData, TValue>({
  column,
  options,
  title,
  customTrigger,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column.getFacetedUniqueValues();
  const selectedValues = new Set(column.getFilterValue() as string[]);
  const displayTitle = title || titleCase(column.id ?? "");

  return (
    <Popover>
      <PopoverTrigger asChild>
        {customTrigger || (
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            {displayTitle}
            {selectedValues.size > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedValues.size}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedValues.size > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedValues.size} selected
                    </Badge>
                  ) : (
                    options
                      .filter((option) => selectedValues.has(option.value))
                      .map((option) => (
                        <Badge
                          variant="secondary"
                          key={option.value}
                          className="rounded-sm px-1 font-normal"
                        >
                          {option.label}
                        </Badge>
                      ))
                  )}
                </div>
              </>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={displayTitle} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(({ label, value, icon: Icon }) => {
                const isSelected = selectedValues.has(value);
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
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {Icon && (
                      <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{label}</span>
                    {facets.get(value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { DataTableFacetedFilter, type DataTableFacetedFilterProps };
