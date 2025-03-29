import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Clock, Calendar, ArrowLeft } from "lucide-react"
import { CastList } from "@/components/cast-list"
import { MediaGallery } from "@/components/media-gallery"
import { TrailerButton } from "@/components/trailer-button"
import { SimilarMedia } from "@/components/similar-media"
import { generateMovieStructuredData } from "@/lib/seo"
import type { Metadata } from "next"

async function getMovieDetails(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,images,similar,recommendations,reviews`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    if (res.status === 404) {
      return notFound()
    }
    throw new Error("Failed to fetch movie details")
  }

  return res.json()
}

async function getMovieGenres() {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 86400 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch movie genres")
  }

  return res.json()
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const movie = await getMovieDetails(params.id)

  // Format release year
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : ""

  // Get director
  const director = movie.credits?.crew?.find((person: any) => person.job === "Director")

  // Format runtime
  const hours = Math.floor(movie.runtime / 60)
  const minutes = movie.runtime % 60
  const formattedRuntime = `${hours}h ${minutes}m`

  // Get genres as string
  const genreNames = movie.genres.map((g: any) => g.name).join(", ")

  return {
    title: `${movie.title} (${releaseYear}) - MovieFlix`,
    description:
      movie.overview ||
      `Watch ${movie.title}, directed by ${director?.name || "unknown"}. ${genreNames} movie with a runtime of ${formattedRuntime}.`,
    keywords: [
      movie.title,
      ...movie.genres.map((g: any) => g.name),
      director?.name,
      "movie",
      "film",
      "watch",
      "stream",
      releaseYear,
    ],
    alternates: {
      canonical: `https://movieflix.example.com/movies/${params.id}`,
    },
    openGraph: {
      title: `${movie.title} (${releaseYear})`,
      description: movie.overview,
      url: `https://movieflix.example.com/movies/${params.id}`,
      siteName: "MovieFlix",
      images: [
        {
          url: `https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`,
          width: 1200,
          height: 630,
          alt: movie.title,
        },
      ],
      locale: "en_US",
      type: "video.movie",
    },
    twitter: {
      card: "summary_large_image",
      title: `${movie.title} (${releaseYear})`,
      description: movie.overview,
      images: [`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`],
    },
  }
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const [movie, genresData] = await Promise.all([getMovieDetails(params.id), getMovieGenres()])

  const trailer = movie.videos?.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")

  const director = movie.credits?.crew?.find((person: any) => person.job === "Director")

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Generate structured data for the movie
  const movieStructuredData = generateMovieStructuredData({
    title: movie.title,
    description: movie.overview,
    image: movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : undefined,
    datePublished: movie.release_date,
    director: director?.name,
    genre: movie.genres.map((g: any) => g.name),
    duration: `PT${Math.floor(movie.runtime / 60)}H${movie.runtime % 60}M`,
    rating: movie.vote_average,
    url: `https://movieflix.example.com/movies/${params.id}`,
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: movieStructuredData }} />
      <main>
        {/* Hero backdrop */}
        <div className="relative w-full h-[70vh]">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10" />
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 z-20 p-6 md:p-10 w-full md:w-2/3">
            <Link href="/" className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{movie.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre: any) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-1 h-4 w-4" />
                <span>{movie.vote_average.toFixed(1)}/10</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
            </div>
            {trailer && <TrailerButton id={movie.id} title={movie.title} type="movie" />}
          </div>
        </div>

        {/* Movie details */}
        <div className="container mx-auto px-4 py-10">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="similar">Similar</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Overview</h2>
                    <p className="text-muted-foreground">{movie.overview}</p>
                  </div>

                  {movie.reviews?.results?.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                      <div className="space-y-4">
                        {movie.reviews.results.slice(0, 2).map((review: any) => (
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
                    <h3 className="font-bold mb-4">Movie Info</h3>
                    <dl className="space-y-4">
                      {director && (
                        <div>
                          <dt className="text-sm text-muted-foreground">Director</dt>
                          <dd>{director.name}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-sm text-muted-foreground">Status</dt>
                        <dd>{movie.status}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">Original Language</dt>
                        <dd>{new Intl.DisplayNames(["en"], { type: "language" }).of(movie.original_language)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">Budget</dt>
                        <dd>
                          {movie.budget
                            ? new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                              }).format(movie.budget)
                            : "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">Revenue</dt>
                        <dd>
                          {movie.revenue
                            ? new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                              }).format(movie.revenue)
                            : "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {movie.production_companies?.length > 0 && (
                    <div className="bg-card rounded-lg p-6">
                      <h3 className="font-bold mb-4">Production Companies</h3>
                      <div className="space-y-4">
                        {movie.production_companies.map((company: any) => (
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

            <TabsContent value="cast">
              <CastList cast={movie.credits?.cast} />
            </TabsContent>

            <TabsContent value="media">
              <MediaGallery videos={movie.videos?.results} images={movie.images} title={movie.title} />
            </TabsContent>

            <TabsContent value="similar">
              <SimilarMedia
                similar={movie.similar?.results}
                recommendations={movie.recommendations?.results}
                genres={genresData.genres}
                type="movie"
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}

