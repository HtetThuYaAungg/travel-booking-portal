"use client";
import React from "react";
import type {
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Asterisk, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Select, { type SingleValue, type MultiValue, type StylesConfig, components } from "react-select";

export type SelectOption = {
  value: string;
  label: string;
};

interface SelectBoxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  options: SelectOption[];
  multiSelect?: boolean;
  searchable?: boolean;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
  clearable?: boolean;
  isCol?: boolean;
  labelSpan?: number;
  inputSpan?: number;
  mainSpan?: number;
  withAsterisk?: boolean;
  menuPlacement?: "auto" | "bottom" | "top";
  menuPortalTarget?: HTMLElement | null;
  menuShouldBlockScroll?: boolean;
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

// Custom styles for react-select to match the existing design system
const customSelectStyles: StylesConfig<SelectOption, boolean> = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "36px",
    height: "36px",
    border: state.isFocused
      ? "1px solid var(--ring)"
      : "1px solid var(--border)",
    borderRadius: "calc(var(--radius) - 2px)",
    backgroundColor: state.isDisabled 
      ? "var(--input) / 0.3"
      : "var(--background)",
    boxShadow: state.isFocused 
      ? "0 0 0 3px var(--ring) / 0.2" 
      : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "&:hover": {
      border: state.isDisabled 
        ? "1px solid var(--border)"
        : "1px solid var(--ring)",
    },
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled ? 0.5 : 1,
    pointerEvents: state.isDisabled ? "none" : "auto",
    transition: "all 0.2s ease-in-out",
    fontSize: "14px",
    fontFamily: "inherit",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "2px 8px",
    height: "100%",
    display: "flex",
    alignItems: "center",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0",
    padding: "0",
    color: "var(--foreground)",
    fontSize: "14px",
    fontFamily: "inherit",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    padding: "0 8px",
    height: "100%",
    display: "flex",
    alignItems: "center",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "var(--muted-foreground)",
    cursor: "pointer",
    pointerEvents: "auto",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.2s ease, color 0.2s ease",
    "&:hover": {
      color: "var(--foreground)",
    },
    padding: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "var(--muted-foreground)",
    cursor: "pointer",
    "&:hover": {
      color: "var(--foreground)",
      backgroundColor: "var(--accent)",
    },
    borderRadius: "50%",
    padding: "2px",
    transition: "all 0.2s ease",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "calc(var(--radius) - 2px)",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
    zIndex: 50,
    marginTop: "4px",
    overflow: "hidden",
    backdropFilter: "blur(8px)",
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 50,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "4px",
    maxHeight: "200px",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "2px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "var(--border)",
      borderRadius: "2px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "var(--muted-foreground)",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "var(--primary)"
      : state.isFocused
      ? "var(--accent)"
      : "transparent",
    color: state.isSelected
      ? "var(--primary-foreground)"
      : "var(--foreground)",
    borderRadius: "calc(var(--radius) - 4px)",
    margin: "2px 0px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.15s ease",
    "&:hover": {
      backgroundColor: state.isSelected
        ? "var(--primary)"
        : "var(--accent)",
    },
    "&:active": {
      backgroundColor: state.isSelected
        ? "var(--primary)"
        : "var(--accent)",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--muted-foreground)",
    fontSize: "14px",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--foreground)",
    fontSize: "14px",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "var(--secondary)",
    borderRadius: "calc(var(--radius) - 4px)",
    margin: "2px 4px 2px 0",
    fontSize: "12px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "var(--secondary-foreground)",
    fontSize: "12px",
    fontFamily: "inherit",
    padding: "2px 6px",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "var(--secondary-foreground)",
    cursor: "pointer",
    borderRadius: "0 calc(var(--radius) - 4px) calc(var(--radius) - 4px) 0",
    padding: "2px 4px",
    "&:hover": {
      backgroundColor: "var(--destructive)",
      color: "var(--destructive-foreground)",
    },
    transition: "all 0.15s ease",
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: "var(--muted-foreground)",
    fontSize: "14px",
    fontFamily: "inherit",
    padding: "12px",
    textAlign: "center",
  }),
  loadingMessage: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
    fontSize: "14px",
    fontFamily: "inherit",
    padding: "12px",
    textAlign: "center",
  }),
};

// Custom DropdownIndicator component to ensure proper click handling
const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown 
        className="h-4 w-4" 
        style={{
          transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}
      />
    </components.DropdownIndicator>
  );
};

export function SelectBox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  options,
  multiSelect = false,
  searchable = false,
  placeholder,
  emptyMessage,
  disabled,
  className,
  maxHeight,
  clearable,
  isCol = false,
  labelSpan = 2,
  inputSpan = 4,
  mainSpan = 6,
  withAsterisk = false,
  menuPlacement = "auto",
  menuPortalTarget,
  menuShouldBlockScroll = false,
}: SelectBoxProps<TFieldValues, TName>) {
  // Get the actual Tailwind classes for the spans
  const labelSpanClass = colSpanMap[labelSpan] || colSpanMap[2];
  const inputSpanClass = colSpanMap[inputSpan] || colSpanMap[4];
  const gridColsClass = gridColsMap[mainSpan] || gridColsMap[6];

  // Handle modal context - find the nearest modal/dialog container
  React.useEffect(() => {
    const findModalContainer = () => {
      let element = document.activeElement;
      while (element && element !== document.body) {
        if (element.getAttribute('role') === 'dialog' || 
            element.classList.contains('modal') ||
            element.classList.contains('dialog') ||
            element.tagName === 'DIALOG') {
          return element as HTMLElement;
        }
        element = element.parentElement;
      }
      return document.body;
    };

    // If no custom portal target is provided, try to find modal container
    if (!menuPortalTarget) {
      const modalContainer = findModalContainer();
      if (modalContainer !== document.body) {
        // We found a modal, but we'll still use document.body for better z-index handling
        // The menuPosition="fixed" should handle positioning correctly
      }
    }
  }, [menuPortalTarget]);

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
          <div className={cn(inputSpanClass, "relative")}>
            <FormControl>
              <Select
                value={
                  multiSelect
                    ? options.filter(option => 
                        Array.isArray(field.value) && field.value.includes(option.value)
                      )
                    : options.find(option => option.value === field.value) || null
                }
                onChange={(selectedOption) => {
                  if (multiSelect) {
                    const values = Array.isArray(selectedOption) 
                      ? selectedOption.map(option => option.value)
                      : [];
                    field.onChange(values);
                  } else {
                    const value = selectedOption ? (selectedOption as SelectOption).value : '';
                    field.onChange(value);
                  }
                }}
                onBlur={field.onBlur}
                options={options}
                isMulti={multiSelect}
                isSearchable={searchable}
                placeholder={placeholder || "Select an option"}
                noOptionsMessage={() => emptyMessage || "No options found"}
                isDisabled={disabled}
                isClearable={clearable}
                styles={customSelectStyles}
                className={className}
                maxMenuHeight={maxHeight || 200}
                menuPlacement={menuPlacement}
                closeMenuOnSelect={!multiSelect}
                hideSelectedOptions={false}
                menuPortalTarget={menuPortalTarget || document.body}
                menuPosition="fixed"
                menuShouldBlockScroll={menuShouldBlockScroll}
                menuShouldScrollIntoView={false}
                components={{
                  DropdownIndicator,
                }}
                tabSelectsValue={false}
                backspaceRemovesValue={false}
              />
            </FormControl>
            <FormMessage className="px-2 text-xs" />
          </div>
        </FormItem>
      )}
    />
  );
}
