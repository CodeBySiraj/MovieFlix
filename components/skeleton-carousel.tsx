import { SkeletonCard } from "@/components/skeleton-card"

interface SkeletonCarouselProps {
  count?: number
  variant?: "movie" | "tv" | "person"
  showTitle?: boolean
}

export function SkeletonCarousel({ count = 5, variant = "movie", showTitle = true }: SkeletonCarouselProps) {
  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
          <div className="h-6 w-20 bg-muted rounded-md animate-pulse" />
        </div>
      )}

      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex-none w-[180px] sm:w-[200px] md:w-[240px]">
            <SkeletonCard variant={variant} />
          </div>
        ))}
      </div>
    </div>
  )
}

