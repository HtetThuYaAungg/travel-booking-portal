"use client";

import { type ReactNode, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  title: string;
  description?: string;
  triggerButton?: ReactNode;
  bottomButton?: ReactNode;
  children: ReactNode;
  onClose?: () => void;
  width?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  // External control props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
}

export default function Modal({
  title,
  description,
  triggerButton,
  bottomButton,
  children,
  onClose,
  width = "sm",
  // External control props
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  hideDefaultTrigger = false,
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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

  const getWidthClass = () => {
    switch (width) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      case "2xl":
        return "max-w-2xl";
      case "3xl":
        return "max-w-3xl";
      case "4xl":
        return "max-w-4xl";
      default:
        return "max-w-md";
    }
  };

  // Set mounted state for client-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        handleOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Handle overlay click to close modal
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleOpenChange(false);
    }
  };

  const modalContent = open && (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={handleOverlayClick}
      />
      
      {/* Modal Content */}
      <div
        className={cn(
          "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] w-[90vw]",
          getWidthClass()
        )}
      >
        <div className="flex flex-col max-h-[90vh]">
          <div className="flex justify-between items-center border-b px-6 py-2">
            <div>
              <h2 className="text-lg font-normal">
                {title}
              </h2>
              {description && (
                <p className="text-sm font-light text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 ">{children}</div>
          {bottomButton && (
            <div className="flex items-center justify-end border-t px-6 py-2">
              {bottomButton}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!hideDefaultTrigger && (
        <div onClick={() => handleOpenChange(true)}>
          {triggerButton || <Button className="gap-2">Create New</Button>}
        </div>
      )}

      {isMounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
