"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export type CustomSelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onBlur?: () => void;
  options: CustomSelectOption[];
  multiSelect?: boolean;
  searchable?: boolean;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
  clearable?: boolean;
};

export function CustomSelect({
  value,
  onChange,
  onBlur,
  options,
  multiSelect = false,
  searchable = false,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  disabled = false,
  className,
  maxHeight = 200,
  clearable = true,
}: CustomSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Initialize value if it's undefined
  React.useEffect(() => {
    if (value === undefined) {
      onChange(multiSelect ? [] : "");
    }
  }, [value, onChange, multiSelect]);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery || !searchable) return options;
    console.log("options", options);
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())  ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery, searchable]);

  console.log("filteredOptions",filteredOptions);
  console.log("searchQuery", searchQuery);

  // For single select
  const selectedOption = React.useMemo(() => {
    if (multiSelect) return null;
    return options.find((option) => option.value === value);
  }, [options, value, multiSelect]);

  // For multi-select
  const selectedValues = React.useMemo(() => {
    if (!multiSelect) return [];
    return Array.isArray(value) ? value : [];
  }, [value, multiSelect]);

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      if (multiSelect) {
        const newSelected = selectedValues.includes(selectedValue)
          ? selectedValues.filter((item) => item !== selectedValue)
          : [...selectedValues, selectedValue];
        onChange(newSelected);
      } else {
        onChange(selectedValue);
        setOpen(false);
        setSearchQuery("");
      }
      // Trigger onBlur to mark the field as touched
      if (onBlur) onBlur();
    },
    [onChange, onBlur, multiSelect, selectedValues]
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(multiSelect ? [] : "");
      if (onBlur) onBlur();
    },
    [onChange, onBlur, multiSelect]
  );

  const handleRemove = React.useCallback(
    (selectedValue: string) => {
      if (!multiSelect) return;
      onChange(selectedValues.filter((item) => item !== selectedValue));
      if (onBlur) onBlur();
    },
    [onChange, onBlur, selectedValues, multiSelect]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
          onClick={() => {
            if (onBlur) onBlur();
          }}
        >
          {multiSelect ? (
            <div className="flex flex-wrap gap-1 max-w-[90%]">
              {selectedValues.length > 0 ? (
                selectedValues.length <= 3 ? (
                  selectedValues.map((val) => {
                    const option = options.find((opt) => opt.value === val);
                    return (
                      <Badge
                        key={val}
                        variant="secondary"
                        className="mr-1 mb-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(val);
                        }}
                      >
                        {option?.label || val}
                        <X className="ml-1 h-3 w-3" />
                      </Badge>
                    );
                  })
                ) : (
                  <span>{selectedValues.length} selected</span>
                )
              ) : (
                <span className="text-muted-foreground font-normal text-sm">
                  {placeholder}
                </span>
              )}
            </div>
          ) : (
            <span className="truncate font-normal text-sm">
                {selectedOption ? selectedOption.label : <span className="text-muted-foreground">{placeholder}</span> }
            </span>
          )}
          <div className="flex items-center">
            {clearable &&
              (multiSelect ? selectedValues.length > 0 : selectedOption) && (
                <X
                  className="mr-1 h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                  onClick={handleClear}
                />
              )}
            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" sideOffset={5}>
        <Command>
          {searchable && (
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search..."
                className="h-9 border-0 outline-none focus:ring-0"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
          )}
          <CommandList
            className="overflow-auto"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                console.log("option >>>>", option);
                return (
                  <>
                   
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleSelect}
                    >
                      {multiSelect ? (
                        <div className="flex items-center">
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              selectedValues.includes(option.value)
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50"
                            )}
                          >
                            {selectedValues.includes(option.value) && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          {option.label}
                        </div>
                      ) : (
                        <>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              option.value === value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </>
                      )}
                    </CommandItem>
                  </>
                );
                })}
             
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
