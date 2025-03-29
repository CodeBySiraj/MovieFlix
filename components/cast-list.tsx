import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface CastListProps {
  cast: any[] | undefined
}

export function CastList({ cast }: CastListProps) {
  if (!cast || cast.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No cast information available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Cast</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cast.slice(0, 20).map((person) => (
          <Link key={person.id} href={`/person/${person.id}`}>
            <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
              <div className="relative aspect-[2/3] bg-muted">
                {person.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <span className="text-muted-foreground text-center">{person.name}</span>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium truncate">{person.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{person.character}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {cast.length > 20 && (
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">Showing 20 of {cast.length} cast members</p>
        </div>
      )}
    </div>
  )
}

