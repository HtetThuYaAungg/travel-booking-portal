"use client";

import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusCircle } from "lucide-react";

interface RightDrawerFormProps {
  title: string;
  description?: string;
  triggerButton?: ReactNode;
  children: ReactNode;
  onClose?: () => void;
  side?: "top" | "bottom" | "left" | "right" | undefined;
  width?: "sm" | "md";
  // External control props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
}

export default function Drawer({
  title,
  description,
  triggerButton,
  children,
  onClose,
  width = "sm",
  side = "right",
  // External control props
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  hideDefaultTrigger = false,
}: RightDrawerFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external or internal state based on whether external control is provided
  const isControlled =
    externalOpen !== undefined && externalOnOpenChange !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      externalOnOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }

    if (!newOpen && onClose) {
      onClose();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {!hideDefaultTrigger && (
        <SheetTrigger asChild>
          {triggerButton || (
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New
            </Button>
          )}
        </SheetTrigger>
      )}
      <SheetContent
        side={side}
        className={` ${
          width === "sm" ? "sm:max-w-sm" : "sm:max-w-md"
        } w-full p-0 flex flex-col`}
      >
        <SheetHeader className=" p-0 border-b px-6 py-2">
          <SheetTitle className=" text-lg font-normal">{title}</SheetTitle>
          {description && (
            <SheetDescription className=" text-sm font-light">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
