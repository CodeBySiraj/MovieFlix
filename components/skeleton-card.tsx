import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonCardProps {
  variant?: "movie" | "tv" | "person" | "featured"
}

export function SkeletonCard({ variant = "movie" }: SkeletonCardProps) {
  const isFeatured = variant === "featured"

  return (
    <Card className="overflow-hidden h-full border-0 bg-transparent">
      <div className={`relative ${isFeatured ? "aspect-[16/9]" : "aspect-[2/3]"} bg-muted rounded-lg overflow-hidden`}>
        <Skeleton className="absolute inset-0" />
      </div>
      <CardContent className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

