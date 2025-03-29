import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowLeft, Clock } from "lucide-react"

async function getTvShowDetails(id: string) {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    if (res.status === 404) {
      return notFound()
    }
    throw new Error("Failed to fetch TV show details")
  }

  return res.json()
}

async function getSeasonDetails(id: string, seasonNumber: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    if (res.status === 404) {
      return notFound()
    }
    throw new Error("Failed to fetch season details")
  }

  return res.json()
}

export async function generateMetadata({ params }: { params: { id: string; seasonNumber: string } }) {
  const [show, season] = await Promise.all([
    getTvShowDetails(params.id),
    getSeasonDetails(params.id, params.seasonNumber),
  ])

  return {
    title: `${season.name} - ${show.name} - MovieFlix`,
    description: season.overview || `Season ${params.seasonNumber} of ${show.name}`,
  }
}

export default async function SeasonPage({ params }: { params: { id: string; seasonNumber: string } }) {
  const [show, season] = await Promise.all([
    getTvShowDetails(params.id),
    getSeasonDetails(params.id, params.seasonNumber),
  ])

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href={`/tv/${params.id}`}
        className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {show.name}
      </Link>

      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="md:w-1/4">
          <div className="sticky top-20">
            <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden mb-4">
              {season.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
                  alt={season.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                  <span className="text-muted-foreground">{season.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Season Info</h2>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">TV Show</h3>
                <p>{show.name}</p>
              </div>

              {season.air_date && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Air Date</h3>
                  <p className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(season.air_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Episodes</h3>
                <p>{season.episodes?.length || 0} Episodes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-3/4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{season.name}</h1>

          {season.overview && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-muted-foreground">{season.overview}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Episodes</h2>
            <div className="space-y-4">
              {season.episodes?.map((episode: any) => (
                <Link
                  key={episode.id}
                  href={`/tv/${params.id}/season/${params.seasonNumber}/episode/${episode.episode_number}`}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-1/3 aspect-video bg-muted">
                        {episode.still_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                            alt={episode.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center p-4">
                            <span className="text-muted-foreground text-center">{episode.name}</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {episode.episode_number}. {episode.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 mb-2">
                              {episode.air_date && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(episode.air_date).toLocaleDateString()}
                                </div>
                              )}
                              {episode.runtime && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {episode.runtime} min
                                </div>
                              )}
                            </div>
                          </div>
                          {episode.vote_average > 0 && (
                            <Badge variant="outline" className="text-yellow-400">
                              ★ {episode.vote_average.toFixed(1)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {episode.overview || "No overview available."}
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

