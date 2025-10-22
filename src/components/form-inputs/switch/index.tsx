import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
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

interface SwitchFormFieldProps {
  control: any;
  name: string;
  label: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  labelSpan?: number;
  inputSpan?: number;
  mainSpan?: number;
  isCol?: boolean;
  labelClassName?: string;
  containerClassName?: string;
  description?: (value: boolean) => string;
}

export const SwitchFormField = ({
  control,
  name,
  label,
  disabled = false,
  labelSpan = 2,
  inputSpan = 4,
  mainSpan = 6,
  isCol = false,
    className = "",
  children,
  description = (value) => (value ? "Enabled" : "Disabled"),
}: SwitchFormFieldProps) => {
  // Get the actual Tailwind classes for the spans
  const labelSpanClass = colSpanMap[labelSpan] || colSpanMap[2];
  const inputSpanClass = colSpanMap[inputSpan] || colSpanMap[4];
  const gridColsClass = gridColsMap[mainSpan] || gridColsMap[6];
  return (
    <FormField
      control={control}
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
            <FormLabel
              htmlFor={name}
              className={cn(
                labelSpanClass,
                "text-sm font-normal flex min-[500px]:justify-start items-start  pt-2 gap-1"
              )}
            >
              {label}
            </FormLabel>
          )}

          <div className={cn(inputSpanClass, "relative  bg-background")}>
            {children ? (
              children
            ) : (
              <FormControl>
                <div className="flex items-center pt-2 space-x-2">
                  <Switch
                    id={name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                  <span className="text-sm text-muted-foreground">
                    {description(field.value)}
                  </span>
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
