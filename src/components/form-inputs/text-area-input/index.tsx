import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"; 
import { cn } from "@/lib/utils";
import { Asterisk } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ReusableFormTextareaProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
  labelSpan?: number;
  inputSpan?: number;
  mainSpan?: number;
  isCol?: boolean;
  icon?: React.ReactNode;
  isDisabled?: boolean;
  rows?: number;
  maxLength?: number;
  withAsterisk?: boolean,

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

export const TextareaInput = ({
  form,
  name,
  label,
  placeholder,
  className = "",
  children,
  labelSpan = 2,
  inputSpan = 4,
  mainSpan = 6,
  isCol = false,
  icon,
  isDisabled = false,
  rows = 3,
  maxLength = 150,
  withAsterisk = false,
}: ReusableFormTextareaProps) => {
  // Get the actual Tailwind classes for the spans
  const labelSpanClass = colSpanMap[labelSpan] || colSpanMap[2];
  const inputSpanClass = colSpanMap[inputSpan] || colSpanMap[4];
  const gridColsClass = gridColsMap[mainSpan] || gridColsMap[6];
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
            {" "}
            {children ? (
              children
            ) : (
              <FormControl>
                <div className="relative">
                  {icon && (
                    <span className="absolute left-3 top-3 text-muted-foreground">
                      {icon}
                    </span>
                  )}
                  <Textarea
                    id={name}
                    placeholder={placeholder}
                    disabled={isDisabled}
                    rows={rows}
                    maxLength={maxLength}
                    className={`text-sm min-h-[80px] ${icon ? "pl-10" : ""}`}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </div>
              </FormControl>
            )}
            <FormMessage className="px-2 text-xs" />
          </div>
        </FormItem>
      )}
    />
  );
};
