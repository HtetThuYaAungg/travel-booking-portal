import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DetailsViewProps<T> {
  id: string | null;
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  render: (data: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  // Optional custom skeleton component
  loadingSkeleton?: React.ReactNode;
}

export function DetailsView<T>({
  id,
  data,
  isLoading,
  isError,
  render,
  emptyMessage = "No data available",
  className = "",
  loadingSkeleton,
}: DetailsViewProps<T>) {
  return (
    <div className={`w-full pt-2 pb-5 px-2 ${className}`}>
      <div>
        {!id ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p className="text-center">{emptyMessage}</p>
          </div>
        ) : isLoading ? (
          <div>{loadingSkeleton || <DefaultSkeleton />}</div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-destructive">
            <AlertCircle className="h-8 w-8" />
            <p className="mt-2">Failed to load data</p>
          </div>
        ) : data ? (
          render(data)
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DefaultSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
