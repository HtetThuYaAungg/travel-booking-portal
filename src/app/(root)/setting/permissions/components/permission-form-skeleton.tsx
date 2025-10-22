import { Skeleton } from "@/components/ui/skeleton";

export default function PermissionFormSkeleton() {
  return (
    <div className="space-y-3 py-2">
       <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>
       <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>
       <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-18 w-full" />
      </div>
   
    </div>
  );
}
