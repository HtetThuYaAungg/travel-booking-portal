"use client";

import type { ReactNode } from "react";
import { Filter } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FilterAccordionProps {
  title?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  isActive: boolean;
}

export function FilterAccordion({
  title = "Filters",
  children,
  defaultOpen = true,
  className = "",
  isActive = false,
}: FilterAccordionProps) {
  return (
    <Card className={`w-full ${className} shadow-none rounded-sm p-0`}>
      <CardContent className="py-2 px-4">
        <Accordion
          type="single"
          collapsible
          defaultValue={defaultOpen ? "filters" : undefined}
          className="w-full"
        >
          <AccordionItem value="filters" className="border-none">
            <AccordionTrigger className="py-1 px-0">
              <div className="flex items-center gap-2">
                <Filter
                  className={cn(
                    "h-3 w-3",
                    isActive && "text-primary fill-primary"
                  )}
                />
                <h2 className="text-md font-semibold">{title}</h2>
                {isActive && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-5 px-2">
              {children}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
