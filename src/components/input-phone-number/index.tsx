"use client";

import type React from "react";
import { forwardRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Country = {
  value: string;
  label: string;
  code: string;
};

export type PhoneInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  onCountryChange?: (country: Country) => void;
  selectedCountry?: Country;
  countries?: Country[];
  label?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: boolean;
  helperText?: string;
  isCol?: boolean;
  showHelperText?: boolean;
};

const defaultCountries: Country[] = [
  { value: "mm", label: "Myanmar", code: "09" },
];

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value = "",
      onChange,
      onCountryChange,
      selectedCountry: propSelectedCountry,
      countries = defaultCountries,
      label = "Phone Number",
      placeholder = "1234567",
      id = "phone",
      name,
      disabled = false,
      required = false,
      className = "",
      error = false,
      isCol = false,
      helperText,
      showHelperText = true,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [internalSelectedCountry, setInternalSelectedCountry] = useState(
      countries[0]
    );
    const selectedCountry = propSelectedCountry || internalSelectedCountry;

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;
      if (inputValue.startsWith(selectedCountry.code)) {
        inputValue = inputValue.substring(selectedCountry.code.length);
      }
      inputValue = inputValue.replace(/[^\d\s-]/g, "");
      if (onChange) {
        onChange(inputValue);
      }
    };

    const handleCountrySelect = (country: Country) => {
      if (!propSelectedCountry) {
        setInternalSelectedCountry(country);
      }
      if (onCountryChange) {
        onCountryChange(country);
      }
      setOpen(false);
    };

    return (
      <div className={cn("grid w-full items-center gap-1.5 pt-1.5", className)}>
        <div
          className={` ${
            isCol
              ? "flex flex-col gap-2"
              : "min-[400px]:grid grid-cols-4 items-center gap-3"
          }`}
        >
          {label && (
            <Label
              htmlFor={id}
              className={`col-span-1 flex min-[400px]:justify-start ${
                error && "text-destructive"
              }`}
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}
          <div
            className={`${
              isCol ? "relative flex" : "relative flex col-span-3"
            }`}
          >
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled}
                  className="w-[110px] justify-between rounded-r-none border-r-0"
                >
                  {selectedCountry.code}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[150px] p-0">
                <Command>
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {countries.map((country) => (
                        <CommandItem
                          key={country.value}
                          value={country.value}
                          onSelect={() => handleCountrySelect(country)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCountry.value === country.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {country.label} ({country.code})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Input
              ref={ref}
              id={id}
              name={name}
              type="tel"
              placeholder={placeholder}
              className={cn("rounded-l-none", error && "border-destructive")}
              value={value || ""}
              onChange={handlePhoneChange}
              disabled={disabled}
              required={required}
              {...props}
            />
          </div>
        </div>
        {showHelperText && (
          <div className="min-[400px]:grid grid-cols-4 items-center">
            <div className=" col-span-1"></div>
            <div className=" col-span-3">
              <p className="text-xs font-medium text-muted-foreground">
                {selectedCountry.code}{" "}
                {value ? value : "Enter your phone number"}
              </p>
            </div>
          </div>
        )}

        {helperText && (
          <p
            className={cn(
              "text-xs font-medium",
              error
                ? "text-destructive text-end pr-5"
                : "text-muted-foreground text-end pr-5"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
