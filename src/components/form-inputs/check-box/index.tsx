import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

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
interface FormCheckboxProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  disabled?: boolean;
  className?: string;
  labelSpan?: number;
  inputSpan?: number;
  mainSpan?: number;
  isCol?: boolean;
  isRightLabel?: boolean;
  onCheckedChange?: (field: string, checked: boolean) => void;
}

export const CheckBox = ({
  form,
  name,
  label,
  disabled = false,
  className = "",
  labelSpan = 2,
  inputSpan = 4,
  mainSpan = 6,
  isRightLabel = false,
  isCol = false,
  onCheckedChange = undefined,
}: FormCheckboxProps) => {
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
          {!isRightLabel ? (
            <>
              <FormLabel
                htmlFor={name}
                className={cn(
                  labelSpanClass,
                  "text-sm font-normal flex min-[500px]:justify-start items-start  pt-2 gap-1"
                )}
              >
                {label}
              </FormLabel>
              <div className={cn(inputSpanClass, "relative  bg-background")}>
                <FormControl>
                  <div className="relative">
                    <Checkbox
                      id={name}
                      checked={field.value}
                      onCheckedChange={
                        onCheckedChange
                          ? (checked: boolean) => {
                              onCheckedChange(name, checked);
                              field.onChange(checked);
                            }
                          : field.onChange
                      }
                      disabled={disabled}
                    />
                  </div>
                </FormControl>
                <FormMessage className="px-2" />
              </div>
            </>
          ) : (
            <>
                {/* <div className={`relative col-span-${labelSpan}`} /> */}
                <div className={cn(inputSpanClass, "relative")}>
                <div className="flex items-start space-x-2">
                  <FormControl>
                    <div className="relative">
                      <Checkbox
                        id={name}
                        checked={field.value}
                        onCheckedChange={
                          onCheckedChange
                            ? (checked: boolean) => {
                                onCheckedChange(name, checked);
                                field.onChange(checked);
                              }
                            : field.onChange
                        }
                        disabled={disabled}
                      />
                    </div>
                  </FormControl>
                  <FormLabel
                    htmlFor={name}
                    className="text-sm font-normal flex min-[400px]:justify-start items-start"
                  >
                    {label}
                  </FormLabel>
                </div>
                <FormMessage className="px-2" />
              </div>
            </>
          )}
        </FormItem>
      )}
    />
  );
};
