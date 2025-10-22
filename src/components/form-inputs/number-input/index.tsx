import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Asterisk, Minus, Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface NumberInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
  className?: string;
  isDisabled?: boolean;
  size?: "sm" | "md" | "lg";
  labelSpan?: number;
  inputSpan?: number;
  mainSpan?: number;
  rightBtn?: React.ReactNode;
  isCol?: boolean;
  withAsterisk?: boolean;
}

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
}

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
}

export const NumberInput = ({
  form,
  name,
  label,
  step = 1,
  description,
  className = "",
  isDisabled = false,
  size = "sm",
  min,
  max,
  labelSpan = 2,
  inputSpan = 4,
  mainSpan = 6,
  isCol = false,
  withAsterisk = false,
  rightBtn,
}: NumberInputProps) => {
  // Get the actual Tailwind classes for the spans
  const labelSpanClass = colSpanMap[labelSpan] || colSpanMap[2];
  const inputSpanClass = colSpanMap[inputSpan] || colSpanMap[4];
  const gridColsClass = gridColsMap[mainSpan] || gridColsMap[6];

  const currentValue = form.watch(name) || 0;

  const handleIncrement = () => {
    if (isDisabled) return;
    let newValue = currentValue + step;
    if (max !== undefined && newValue > max) {
      newValue = max;
    }
    form.setValue(name, newValue);
  };

  const handleDecrement = () => {
    if (isDisabled) return;
    let newValue = currentValue - step;
    if (min !== undefined && newValue < min) {
      newValue = min;
    }
    form.setValue(name, newValue);
  };

  const isMinReached = min !== undefined && currentValue <= min;
  const isMaxReached = max !== undefined && currentValue >= max;

  const sizeClasses = {
    sm: {
      container: "h-8",
      button: "h-8 w-8 text-sm",
      display: "h-8 min-w-12 text-sm font-medium",
    },
    md: {
      container: "h-10",
      button: "h-10 w-10",
      display: "h-10 min-w-16 text-base font-semibold",
    },
    lg: {
      container: "h-12",
      button: "h-12 w-12 text-lg",
      display: "h-12 min-w-20 text-lg font-semibold",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
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
                "text-sm font-normal flex min-[500px]:justify-start items-start  pt-2 gap-1"
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

          <div className={cn(inputSpanClass, "relative  bg-background")}>
            <FormControl>
              <div
                className={`inline-flex items-center bg-background rounded-xl transition-all duration-200 ${
                  currentSize.container
                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {/* Decrement Button */}
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isDisabled || isMinReached}
                  onClick={handleDecrement}
                  className={`${currentSize.button} rounded-r-none rounded-l-xl border border-muted bg-gradient-to-r from-background to-background/95 hover:from-background/95 hover:to-background text-red-600 hover:text-red-700 disabled:from-background/90 disabled:to-background disabled:text-gray-400 transition-all duration-200`}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                {/* Value Display */}
                <div
                  className={`${currentSize.display} flex items-center justify-center bg-background/95 text-muted-foreground border-y border-muted select-none`}
                >
                  {currentValue}
                </div>

                {/* Increment Button */}
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isDisabled || isMaxReached}
                  onClick={handleIncrement}
                  className={`${currentSize.button} rounded-r-xl rounded-l-none border border-muted bg-gradient-to-r from-background to-background/95 hover:from-background/95 hover:to-background text-green-600 hover:text-green-700 disabled:from-background/90 disabled:to-background disabled:text-gray-400 transition-all duration-200`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </FormControl>
            {description && (
              <FormDescription className="text-xs">
                {description}
              </FormDescription>
            )}
            <FormMessage className="px-2 text-xs" />
          </div>
        </FormItem>
      )}
    />
  );
};
