import { Skeleton } from "@/components/ui/skeleton"

export function BookCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[3/4] rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  )
}
