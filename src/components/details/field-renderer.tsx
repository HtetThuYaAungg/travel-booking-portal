import type { ReactNode } from "react";

interface UniversalFieldRendererProps {
  label: string;
  value: ReactNode;
  span?: "full" | "half" | "third";
  className?: string;
  depth?: number;
}

export function UniversalFieldRenderer({
  label,
  value,
  span = "full",
  className = "",
  depth = 0,
}: UniversalFieldRendererProps) {
  const spanClasses = {
    full: "col-span-1",
    half: "col-span-2",
    third: "col-span-3",
  };

  return (
    <div
      className={`${spanClasses[span]} ${className} ${
        depth > 0 ? "pl-4 border-l-2 border-muted flex justify-start gap-2" : ""
      }`}
    >
      <h4 className="text-sm font-normal text-muted-foreground capitalize">
        {label}
      </h4>
      <div className={` ${depth > 0 ? "" : " mt-1"} text-sm font-normal`}>
        {value && value !== "null" ? (
          value
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </div>
    </div>
  );
}
