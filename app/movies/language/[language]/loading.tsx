import { Card, CardContent } from "@/components/ui/card"
import { SkeletonCard } from "@/components/skeleton-card"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-36 bg-muted rounded animate-pulse mb-6" />

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="md:w-2/3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-10 bg-muted rounded animate-pulse" />
            <div className="h-10 w-64 bg-muted rounded animate-pulse" />
          </div>

          <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          </div>

          <div className="mb-6">
            <div className="h-6 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-6 w-24 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-1/3 bg-card rounded-lg border p-4">
          <div className="h-6 w-32 bg-muted rounded animate-pulse mb-3" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-start">
                <div className="h-4 w-20 bg-muted rounded animate-pulse mr-2" />
                <div className="h-4 w-40 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-4 space-y-2">
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        <div className="h-10 w-64 bg-muted rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {Array.from({ length: 20 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  )
}

