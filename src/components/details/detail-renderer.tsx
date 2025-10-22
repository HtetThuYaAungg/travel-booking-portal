import type React from "react";
import { UniversalFieldRenderer } from "./field-renderer";

interface UniversalDetailsRendererProps {
  data: Record<string, any>;
  excludeFields?: string[];
  customRenderers?: Record<string, (value: any) => React.ReactNode>;
  depth?: number;
}

const isObject = (value: any) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function UniversalDetailsRenderer({
  data,
  excludeFields = ["id"],
  customRenderers = {},
  depth = 0,
}: UniversalDetailsRendererProps) {
  const renderValue = (key: string, value: any): React.ReactNode => {
    // Use custom renderer if available
    if (customRenderers[key]) {
      return customRenderers[key](value);
    }

    // Handle nested objects
    if (isObject(value)) {
      return (
        <div className="mt-5">
          <UniversalDetailsRenderer
            data={value}
            excludeFields={excludeFields}
            customRenderers={customRenderers}
            depth={depth + 1}
          />
        </div>
      );
    }

    // Format dates
    if (typeof value === "string" && !isNaN(Date.parse(value))) {
      return new Date(value).toLocaleString();
    }

    // Default rendering
    return String(value);
  };

  return (
    <div className={`grid grid-cols-1 gap-4 ${depth > 0 ? "mt-2" : ""}`}>
      {Object.entries(data)
        .filter(([key]) => !excludeFields.includes(key))
        .map(([key, value]) => {
          const readableLabel = key
            .replace(/([A-Z])/g, " $1")
            .replace(/_/g, " ")
            .replace(/^ /, "")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            <UniversalFieldRenderer
              key={key}
              label={readableLabel}
              value={renderValue(key, value)}
              depth={depth}
            />
          );
        })}
    </div>
  );
}
