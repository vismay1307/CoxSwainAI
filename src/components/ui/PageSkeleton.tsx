import { Skeleton } from "@/components/ui/Skeleton";

type PageSkeletonProps = {
  cards?: number;
  rows?: number;
};

export default function PageSkeleton({
  cards = 3,
  rows = 4,
}: PageSkeletonProps) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 w-full rounded-[2rem]" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-[1.75rem]" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-[1.5rem]" />
        ))}
      </div>
    </div>
  );
}
