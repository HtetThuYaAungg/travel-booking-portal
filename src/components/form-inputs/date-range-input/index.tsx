"use client";

import type React from "react";
import { format } from "date-fns";
import { Asterisk, CalendarIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

const isFirefox = typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("firefox");
const isSafari =
  typeof navigator !== "undefined" &&
  navigator.userAgent.toLowerCase().includes("safari") &&
  !navigator.userAgent.toLowerCase().includes("chrome");
const needsSpecialHandling = isFirefox || isSafari;

// Mapping for common grid configurations
const gridColsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};

const colSpanMap: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

interface DateRangeInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  fromDate?: Date;
  toDate?: Date;
  popoverOpen?: boolean;
  onPopoverOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  labelSpan?: number;
  inputSpan?: number;
  mainSpan?: number;
  isCol?: boolean;
  withAsterisk?: boolean;
  numberOfMonths?: number;
}

export const DateRangeInput = ({
  form,
  name,
  label,
  placeholder = "Select date range",
  disabled = false,
  className = "",
  dateFormat = "dd-MM-yyyy",
  fromDate,
  toDate,
  popoverOpen: externalPopoverOpen,
  onPopoverOpenChange: externalOnPopoverOpenChange,
  labelSpan = 2,
  inputSpan = 4,
  mainSpan = 6,
  isCol = false,
  withAsterisk = false,
  children,
  numberOfMonths = 2,
}: DateRangeInputProps) => {
  const [internalPopoverOpen, setInternalPopoverOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Detect client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use external state if provided, otherwise use internal state
  const popoverOpen =
    externalPopoverOpen !== undefined
      ? externalPopoverOpen
      : internalPopoverOpen;
  const onPopoverOpenChange =
    externalOnPopoverOpenChange || setInternalPopoverOpen;

  // Get the actual Tailwind classes for the spans
  const labelSpanClass = colSpanMap[labelSpan] || colSpanMap[2];
  const inputSpanClass = colSpanMap[inputSpan] || colSpanMap[4];
  const gridColsClass = gridColsMap[mainSpan] || gridColsMap[6];

  const isDisabled = disabled;

  // Firefox-specific popover handling
  const handleFirefoxPopoverToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled) return;

    // Force close any other open popovers
    document.querySelectorAll('[data-state="open"]').forEach((el) => {
      if (
        el !== buttonRef.current?.closest("[data-radix-popper-content-wrapper]")
      ) {
        const closeButton = el.querySelector(
          "[data-radix-popover-close]"
        ) as HTMLElement;
        closeButton?.click();
      }
    });

    // Toggle with a small delay for Firefox
    setTimeout(() => {
      onPopoverOpenChange(!popoverOpen);
    }, 10);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const value = form.watch(name);

        return (
          <FormItem
            className={cn(
              isCol
                ? "flex flex-col"
                : `flex flex-col min-[500px]:grid ${gridColsClass}`,
              className
            )}
          >
            {label && (
              <label
                htmlFor={name}
                className={cn(
                  labelSpanClass,
                  "text-sm font-normal flex min-[500px]:justify-start items-start pt-2 gap-1"
                )}
              >
                <p>{label}</p>
                {withAsterisk && (
                  <p className="text-xs flex items-center pt-0.5">
                    ({" "}
                    <FormLabel className="pt-0.5">
                      <Asterisk className="h-2.5 w-2.5" />
                    </FormLabel>
                    )
                  </p>
                )}
              </label>
            )}

            <div className={cn(inputSpanClass, "relative bg-background")}>
              {children ? (
                children
              ) : isClient && needsSpecialHandling ? (
                // Firefox-specific implementation
                <div className="space-y-2">
                  <Popover
                    open={popoverOpen}
                    onOpenChange={onPopoverOpenChange}
                    modal={true}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          ref={buttonRef}
                          type="button"
                          variant="outline"
                          disabled={isDisabled}
                          className={cn(
                            "w-full pl-3 text-left font-normal justify-start",
                            !value?.from && "text-muted-foreground",
                            isDisabled && "opacity-50 cursor-not-allowed"
                          )}
                          onMouseDown={handleFirefoxPopoverToggle}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleFirefoxPopoverToggle(e as any);
                            }
                          }}
                        >
                          {value?.from ? (
                            value.to ? (
                              <>
                                {format(value.from, dateFormat)} -{" "}
                                {format(value.to, dateFormat)}
                              </>
                            ) : (
                              format(value.from, dateFormat)
                            )
                          ) : (
                            <span>{placeholder}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      ref={calendarRef}
                      className="w-auto p-0 z-50"
                      align="start"
                      side="bottom"
                      sideOffset={4}
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                      onEscapeKeyDown={() => onPopoverOpenChange(false)}
                      onPointerDownOutside={() => onPopoverOpenChange(false)}
                    >
                      <Calendar
                        mode="range"
                        selected={value as DateRange}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          if (isDisabled) return true;
                          if (fromDate && date < fromDate) return true;
                          if (toDate && date > toDate) return true;
                          return false;
                        }}
                        initialFocus={false}
                        numberOfMonths={numberOfMonths}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                // Standard implementation for other browsers
                <Popover open={popoverOpen} onOpenChange={onPopoverOpenChange}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isDisabled}
                        className={cn(
                          "w-full pl-3 text-left font-normal justify-start",
                          !value?.from && "text-muted-foreground",
                          isDisabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {value?.from ? (
                          value.to ? (
                            <>
                              {format(value.from, dateFormat)} -{" "}
                              {format(value.to, dateFormat)}
                            </>
                          ) : (
                            format(value.from, dateFormat)
                          )
                        ) : (
                          <span>{placeholder}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={value?.from}
                      selected={value as DateRange}
                      onSelect={field.onChange}
                      numberOfMonths={numberOfMonths}
                      disabled={(date) => {
                        if (isDisabled) return true;
                        if (fromDate && date < fromDate) return true;
                        if (toDate && date > toDate) return true;
                        return false;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}

              <FormMessage className="px-2 text-xs" />
            </div>
          </FormItem>
        );
      }}
    />
  );
}; 