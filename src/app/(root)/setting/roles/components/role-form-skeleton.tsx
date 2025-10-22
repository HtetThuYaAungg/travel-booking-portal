"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function RoleFormSkeleton() {
  return (
    <div className="space-y-3 pt-3 py-2">
      <div className="space-y-2 gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />

        <div className="space-y-2 border rounded-md p-3">
          {Array.from({ length: 3 }).map((_, categoryIndex) => (
            <div key={categoryIndex} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>

              <div className="ml-6 space-y-1">
                {Array.from({ length: 2 + Math.floor(Math.random() * 3) }).map(
                  (_, subIndex) => (
                    <div key={subIndex} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
