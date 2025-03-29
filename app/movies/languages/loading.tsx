import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-64 bg-muted rounded animate-pulse mb-2" />
      <div className="h-5 w-96 bg-muted rounded animate-pulse mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-muted rounded-lg h-64 animate-pulse" />
        <div className="bg-muted rounded-lg h-64 animate-pulse" />
      </div>

      <div className="mb-12">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden h-full">
              <div className="aspect-video bg-muted animate-pulse" />
              <CardContent className="p-4 space-y-2">
                <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {Array.from({ length: 3 }).map((_, regionIndex) => (
        <div key={regionIndex} className="mb-10">
          <div className="h-6 w-36 bg-muted rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-6 h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

