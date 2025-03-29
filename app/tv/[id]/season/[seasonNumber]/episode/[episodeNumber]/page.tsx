import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, ArrowLeft, Star } from "lucide-react"
import { CastList } from "@/components/cast-list"
import { MediaGallery } from "@/components/media-gallery"

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

async function getEpisodeDetails(id: string, seasonNumber: string, episodeNumber: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=credits,images,videos`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    if (res.status === 404) {
      return notFound()
    }
    throw new Error("Failed to fetch episode details")
  }

  return res.json()
}

export async function generateMetadata({
  params,
}: {
  params: { id: string; seasonNumber: string; episodeNumber: string }
}) {
  const [show, episode] = await Promise.all([
    getTvShowDetails(params.id),
    getEpisodeDetails(params.id, params.seasonNumber, params.episodeNumber),
  ])

  return {
    title: `${episode.name} - ${show.name} - MovieFlix`,
    description: episode.overview || `Episode ${params.episodeNumber} of Season ${params.seasonNumber} of ${show.name}`,
  }
}

export default async function EpisodePage({
  params,
}: {
  params: { id: string; seasonNumber: string; episodeNumber: string }
}) {
  const [show, episode] = await Promise.all([
    getTvShowDetails(params.id),
    getEpisodeDetails(params.id, params.seasonNumber, params.episodeNumber),
  ])

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "Unknown runtime"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <main>
      {/* Hero backdrop */}
      <div className="relative w-full h-[50vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10" />
        <Image
          src={
            episode.still_path
              ? `https://image.tmdb.org/t/p/original${episode.still_path}`
              : show.backdrop_path
                ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
                : "/placeholder.svg?height=1080&width=1920"
          }
          alt={episode.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 z-20 p-6 md:p-10 w-full md:w-2/3">
          <Link
            href={`/tv/${params.id}/season/${params.seasonNumber}`}
            className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Season {params.seasonNumber}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{episode.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
            <Badge variant="outline">
              S{params.seasonNumber} E{params.episodeNumber}
            </Badge>
            {episode.vote_average > 0 && (
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-1 h-4 w-4" />
                <span>{episode.vote_average.toFixed(1)}/10</span>
              </div>
            )}
            {episode.runtime > 0 && (
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{formatRuntime(episode.runtime)}</span>
              </div>
            )}
            {episode.air_date && (
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{new Date(episode.air_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Episode details */}
      <div className="container mx-auto px-4 py-10">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cast">Guest Cast</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Overview</h2>
                  <p className="text-muted-foreground">
                    {episode.overview || "No overview available for this episode."}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card rounded-lg p-6">
                  <h3 className="font-bold mb-4">Episode Info</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">TV Show</dt>
                      <dd>
                        <Link href={`/tv/${params.id}`} className="hover:text-primary transition-colors">
                          {show.name}
                        </Link>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Season</dt>
                      <dd>
                        <Link
                          href={`/tv/${params.id}/season/${params.seasonNumber}`}
                          className="hover:text-primary transition-colors"
                        >
                          Season {params.seasonNumber}
                        </Link>
                      </dd>
                    </div>
                    {episode.crew?.length > 0 && (
                      <div>
                        <dt className="text-sm text-muted-foreground">Director</dt>
                        <dd>
                          {episode.crew
                            .filter((person: any) => person.job === "Director")
                            .map((person: any) => person.name)
                            .join(", ") || "Unknown"}
                        </dd>
                      </div>
                    )}
                    {episode.crew?.length > 0 && (
                      <div>
                        <dt className="text-sm text-muted-foreground">Writers</dt>
                        <dd>
                          {episode.crew
                            .filter((person: any) => person.department === "Writing")
                            .map((person: any) => person.name)
                            .join(", ") || "Unknown"}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cast">
            <CastList cast={episode.credits?.cast} />
          </TabsContent>

          <TabsContent value="media">
            <MediaGallery
              videos={episode.videos?.results}
              images={{ stills: episode.images?.stills }}
              title={episode.name}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

