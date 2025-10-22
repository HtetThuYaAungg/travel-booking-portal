"use client";

import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MonthPickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
  downloadExcel?: () => void;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function MonthPicker({
  value,
  onChange,
  disabled = false,
  placeholder = "Select month",
  className,
  isDisabled,
  downloadExcel,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(() => {
    return value ? value.getFullYear() : new Date().getFullYear();
  });

  const handleMonthSelect = (monthIndex: number) => {
    const selectedDate = new Date(currentYear, monthIndex, 1);
    onChange?.(selectedDate);
    setOpen(false);
  };

  const handleYearChange = (direction: "prev" | "next") => {
    setCurrentYear((prev) => (direction === "prev" ? prev - 1 : prev + 1));
  };

  const isCurrentMonth = (monthIndex: number) => {
    const now = new Date();
    return currentYear === now.getFullYear() && monthIndex === now.getMonth();
  };

  const isSelectedMonth = (monthIndex: number) => {
    if (!value) return false;
    return (
      currentYear === value.getFullYear() && monthIndex === value.getMonth()
    );
  };

  const isFutureMonth = (monthIndex: number) => {
    const now = new Date();
    if (currentYear > now.getFullYear()) return true;
    if (currentYear === now.getFullYear() && monthIndex > now.getMonth())
      return true;
    return false;
  };

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] rounded-r-none justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "MMM yyyy") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            {/* Year Navigation */}
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleYearChange("prev")}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{currentYear}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleYearChange("next")}
                className="h-8 w-8 p-0"
                disabled={currentYear >= new Date().getFullYear()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Months Grid */}
            <div className="grid grid-cols-3 gap-1">
              {months.map((month, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 text-xs",
                    isSelectedMonth(index) &&
                      "bg-primary text-primary-foreground hover:bg-primary",
                    isCurrentMonth(index) &&
                      !isSelectedMonth(index) &&
                      "bg-accent",
                    isFutureMonth(index) &&
                      "text-muted-foreground cursor-not-allowed"
                  )}
                  onClick={() =>
                    !isFutureMonth(index) && handleMonthSelect(index)
                  }
                  disabled={isFutureMonth(index)}
                >
                  {month}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        size={"icon"}
        disabled={isDisabled}
        onClick={downloadExcel}
        className=" rounded-l-none"
      >
        <Download className="h-3 w-3" />
      </Button>
    </div>
  );
}
