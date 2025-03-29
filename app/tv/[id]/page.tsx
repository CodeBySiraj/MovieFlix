import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Calendar, ArrowLeft } from "lucide-react"
import { SeasonsList } from "@/components/seasons-list"
import { CastList } from "@/components/cast-list"
import { MediaGallery } from "@/components/media-gallery"
import { TrailerButton } from "@/components/trailer-button"
import { SimilarMedia } from "@/components/similar-media"
import { generateTVShowStructuredData } from "@/lib/seo"
import type { Metadata } from "next"

async function getTvShowDetails(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,images,similar,recommendations,reviews`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    if (res.status === 404) {
      return notFound()
    }
    throw new Error("Failed to fetch TV show details")
  }

  return res.json()
}

async function getTvGenres() {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 86400 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch TV genres")
  }

  return res.json()
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const show = await getTvShowDetails(params.id)

  // Format first air year
  const firstAirYear = show.first_air_date ? new Date(show.first_air_date).getFullYear() : ""

  // Get creator
  const creator = show.created_by?.length > 0 ? show.created_by[0] : null

  // Get genres as string
  const genreNames = show.genres.map((g: any) => g.name).join(", ")

  return {
    title: `${show.name} (TV Series ${firstAirYear}) - MovieFlix`,
    description:
      show.overview ||
      `Watch ${show.name}, created by ${creator?.name || "unknown"}. ${genreNames} TV series with ${show.number_of_seasons} seasons.`,
    keywords: [
      show.name,
      ...show.genres.map((g: any) => g.name),
      creator?.name,
      "tv show",
      "series",
      "watch",
      "stream",
      firstAirYear,
    ],
    alternates: {
      canonical: `https://movieflix.example.com/tv/${params.id}`,
    },
    openGraph: {
      title: `${show.name} (TV Series ${firstAirYear})`,
      description: show.overview,
      url: `https://movieflix.example.com/tv/${params.id}`,
      siteName: "MovieFlix",
      images: [
        {
          url: `https://image.tmdb.org/t/p/original${show.backdrop_path || show.poster_path}`,
          width: 1200,
          height: 630,
          alt: show.name,
        },
      ],
      locale: "en_US",
      type: "video.tv_show",
    },
    twitter: {
      card: "summary_large_image",
      title: `${show.name} (TV Series ${firstAirYear})`,
      description: show.overview,
      images: [`https://image.tmdb.org/t/p/original${show.backdrop_path || show.poster_path}`],
    },
  }
}

export default async function TvShowPage({ params }: { params: { id: string } }) {
  const [show, genresData] = await Promise.all([getTvShowDetails(params.id), getTvGenres()])

  const trailer = show.videos?.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")

  const creator = show.created_by?.length > 0 ? show.created_by[0] : null

  // Generate structured data for the TV show
  const tvShowStructuredData = generateTVShowStructuredData({
    title: show.name,
    description: show.overview,
    image: show.poster_path ? `https://image.tmdb.org/t/p/original${show.poster_path}` : undefined,
    datePublished: show.first_air_date,
    creator: creator?.name,
    genre: show.genres.map((g: any) => g.name),
    seasons: show.number_of_seasons,
    rating: show.vote_average,
    url: `https://movieflix.example.com/tv/${params.id}`,
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: tvShowStructuredData }} />
      <main>
        {/* Hero backdrop */}
        <div className="relative w-full h-[70vh]">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10" />
          <Image
            src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
            alt={show.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 z-20 p-6 md:p-10 w-full md:w-2/3">
            <Link href="/tv" className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to TV Shows
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{show.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {show.genres.map((genre: any) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-1 h-4 w-4" />
                <span>{show.vote_average.toFixed(1)}/10</span>
              </div>
              <div className="flex items-center">
                <span>
                  {show.number_of_seasons} {show.number_of_seasons === 1 ? "Season" : "Seasons"}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{new Date(show.first_air_date).getFullYear()}</span>
                {show.status === "Ended" && show.last_air_date && (
                  <span> - {new Date(show.last_air_date).getFullYear()}</span>
                )}
              </div>
            </div>
            {trailer && <TrailerButton id={show.id} title={show.name} type="tv" />}
          </div>
        </div>

        {/* TV show details */}
        <div className="container mx-auto px-4 py-10">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="seasons">Seasons</TabsTrigger>
              <TabsTrigger value="cast">Cast</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="similar">Similar</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Overview</h2>
                    <p className="text-muted-foreground">{show.overview}</p>
                  </div>

                  {show.reviews?.results?.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                      <div className="space-y-4">
                        {show.reviews.results.slice(0, 2).map((review: any) => (
                          <div key={review.id} className="bg-card rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{review.author}</h3>
                              {review.author_details.rating && (
                                <Badge variant="outline" className="text-yellow-400">
                                  ★ {review.author_details.rating}/10
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">{review.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-6">
                    <h3 className="font-bold mb-4">Show Info</h3>
                    <dl className="space-y-4">
                      {creator && (
                        <div>
                          <dt className="text-sm text-muted-foreground">Created By</dt>
                          <dd>{creator.name}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-sm text-muted-foreground">Status</dt>
                        <dd>{show.status}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">Original Language</dt>
                        <dd>{new Intl.DisplayNames(["en"], { type: "language" }).of(show.original_language)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">Networks</dt>
                        <dd className="flex flex-wrap gap-2 mt-1">
                          {show.networks.map((network: any) => (
                            <div
                              key={network.id}
                              className="relative h-8 w-16 bg-white rounded flex items-center justify-center p-1"
                            >
                              {network.logo_path ? (
                                <Image
                                  src={`https://image.tmdb.org/t/p/w92${network.logo_path}`}
                                  alt={network.name}
                                  fill
                                  className="object-contain"
                                />
                              ) : (
                                <span className="text-xs text-black">{network.name}</span>
                              )}
                            </div>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {show.production_companies?.length > 0 && (
                    <div className="bg-card rounded-lg p-6">
                      <h3 className="font-bold mb-4">Production Companies</h3>
                      <div className="space-y-4">
                        {show.production_companies.map((company: any) => (
                          <div key={company.id} className="flex items-center gap-3">
                            {company.logo_path ? (
                              <div className="relative h-10 w-16 bg-white rounded flex items-center justify-center p-1">
                                <Image
                                  src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                                  alt={company.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-16 bg-muted rounded flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">No logo</span>
                              </div>
                            )}
                            <span>{company.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seasons">
              <SeasonsList seasons={show.seasons} showId={show.id} />
            </TabsContent>

            <TabsContent value="cast">
              <CastList cast={show.credits?.cast} />
            </TabsContent>

            <TabsContent value="media">
              <MediaGallery videos={show.videos?.results} images={show.images} title={show.name} />
            </TabsContent>

            <TabsContent value="similar">
              <SimilarMedia
                similar={show.similar?.results}
                recommendations={show.recommendations?.results}
                genres={genresData.genres}
                type="tv"
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}

