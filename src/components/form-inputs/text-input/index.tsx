import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Asterisk } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ReusableFormInputProps {
  form: UseFormReturn<any>; // Replace 'any' with your form type if available
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  children?: React.ReactNode;
  labelSpan?: number;
  inputSpan?: number;
  mainSpan?: number;
  isCol?: boolean;
  icon?: React.ReactNode;
  rightBtn?: React.ReactNode;
  isDisabled?: boolean;
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

export const TextInput = ({
  form,
  name,
  label,
  placeholder,
  type = "text",
  className = "",
  children,
  labelSpan = 2,
  inputSpan = 4,
  mainSpan = 6,
  isCol = false,
  icon,
  rightBtn,
  isDisabled = false,
  withAsterisk = false,
}: ReusableFormInputProps) => {
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
            {children ? (
              children
            ) : (
              <FormControl>
                <div className="relative">
                  {icon && (
                    <span className="absolute left-3 top-1/2 p -translate-y-1/2 text-muted-foreground">
                      {icon}
                    </span>
                  )}
                  <Input
                    id={name}
                    placeholder={placeholder}
                    type={type}
                    disabled={isDisabled}
                    className={` text-sm ${
                      icon ? `pl-10 ${rightBtn ? "pr-10" : ""}` : ""
                    } `}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  {rightBtn && (
                    <div className="absolute right-0 top-0">{rightBtn}</div>
                  )}
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
