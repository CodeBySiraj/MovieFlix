import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface SeasonsListProps {
  seasons: any[]
  showId: number
}

export function SeasonsList({ seasons, showId }: SeasonsListProps) {
  // Filter out specials (season 0) and sort by season number
  const filteredSeasons = seasons
    .filter((season) => season.season_number > 0)
    .sort((a, b) => a.season_number - b.season_number)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Seasons</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSeasons.map((season) => (
          <Link key={season.id} href={`/tv/${showId}/season/${season.season_number}`}>
            <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-1/3 aspect-[2/3] bg-muted">
                  {season.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                      alt={season.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <span className="text-muted-foreground text-center">{season.name}</span>
                    </div>
                  )}
                </div>
                <CardContent className="flex-1 p-4">
                  <h3 className="text-lg font-semibold mb-1">{season.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">
                      {season.episode_count} {season.episode_count === 1 ? "Episode" : "Episodes"}
                    </Badge>
                    {season.air_date && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(season.air_date).getFullYear()}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {season.overview || "No overview available."}
                  </p>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

