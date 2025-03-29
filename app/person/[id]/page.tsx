import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, MapPin } from "lucide-react"
import { generatePersonStructuredData } from "@/lib/seo"
import type { Metadata } from "next"

async function getPersonDetails(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=combined_credits,images`,
    { next: { revalidate: 86400 } },
  )

  if (!res.ok) {
    if (res.status === 404) {
      return notFound()
    }
    throw new Error("Failed to fetch person details")
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
  const person = await getPersonDetails(params.id)

  // Get known for titles
  const knownForTitles = person.known_for_department || ""

  // Get birth year
  const birthYear = person.birthday ? new Date(person.birthday).getFullYear() : ""

  // Create a short bio
  const shortBio = person.biography
    ? person.biography.substring(0, 160) + "..."
    : `${person.name} is known for ${knownForTitles}.`

  return {
    title: `${person.name} - Actor, Director, Filmmaker - MovieFlix`,
    description: shortBio,
    keywords: [
      person.name,
      person.known_for_department,
      "actor",
      "actress",
      "director",
      "filmmaker",
      "celebrity",
      "movies",
      "tv shows",
    ],
    alternates: {
      canonical: `https://movieflix.example.com/person/${params.id}`,
    },
    openGraph: {
      title: person.name,
      description: shortBio,
      url: `https://movieflix.example.com/person/${params.id}`,
      siteName: "MovieFlix",
      images: [
        {
          url: person.profile_path
            ? `https://image.tmdb.org/t/p/original${person.profile_path}`
            : "https://movieflix.example.com/person-placeholder.jpg",
          width: 1200,
          height: 630,
          alt: person.name,
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: person.name,
      description: shortBio,
      images: [
        person.profile_path
          ? `https://image.tmdb.org/t/p/original${person.profile_path}`
          : "https://movieflix.example.com/person-placeholder.jpg",
      ],
    },
  }
}

export default async function PersonPage({ params }: { params: { id: string } }) {
  const [person, movieGenresData, tvGenresData] = await Promise.all([
    getPersonDetails(params.id),
    getMovieGenres(),
    getTvGenres(),
  ])

  // Combine all genres for easy lookup
  const allGenres = [...movieGenresData.genres, ...tvGenresData.genres]
  const uniqueGenres = Array.from(new Map(allGenres.map((genre) => [genre.id, genre])).values())

  // Sort credits by popularity
  const sortedMovieCredits =
    person.combined_credits?.cast
      ?.filter((credit: any) => credit.media_type === "movie")
      ?.sort((a: any, b: any) => b.popularity - a.popularity) || []

  const sortedTvCredits =
    person.combined_credits?.cast
      ?.filter((credit: any) => credit.media_type === "tv")
      ?.sort((a: any, b: any) => b.popularity - a.popularity) || []

  // Calculate age or age at death
  const calculateAge = () => {
    if (!person.birthday) return null

    const birthDate = new Date(person.birthday)
    let endDate = new Date()
    let ageLabel = "Age"

    if (person.deathday) {
      endDate = new Date(person.deathday)
      ageLabel = "Age at death"
    }

    const age =
      endDate.getFullYear() -
      birthDate.getFullYear() -
      (endDate.getMonth() < birthDate.getMonth() ||
      (endDate.getMonth() === birthDate.getMonth() && endDate.getDate() < birthDate.getDate())
        ? 1
        : 0)

    return { age, label: ageLabel }
  }

  const ageInfo = calculateAge()

  // Generate structured data for the person
  const personStructuredData = generatePersonStructuredData({
    name: person.name,
    description: person.biography,
    image: person.profile_path ? `https://image.tmdb.org/t/p/original${person.profile_path}` : undefined,
    birthDate: person.birthday,
    deathDate: person.deathday,
    url: `https://movieflix.example.com/person/${params.id}`,
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personStructuredData }} />
      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden mb-4">
                {person.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                    alt={person.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <span className="text-muted-foreground text-center">{person.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Personal Info</h2>
                </div>

                {person.known_for_department && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Known For</h3>
                    <p>{person.known_for_department}</p>
                  </div>
                )}

                {person.gender && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
                    <p>{person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "Not specified"}</p>
                  </div>
                )}

                {person.birthday && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Birthday</h3>
                    <p className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(person.birthday).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {ageInfo && (
                        <span className="ml-1 text-muted-foreground">
                          ({ageInfo.label}: {ageInfo.age})
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {person.deathday && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Died</h3>
                    <p className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(person.deathday).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {person.place_of_birth && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Place of Birth</h3>
                    <p className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {person.place_of_birth}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{person.name}</h1>

            {person.biography && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Biography</h2>
                <div className="text-muted-foreground space-y-4">
                  {person.biography.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            <Tabs defaultValue="movies" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="movies">Movies</TabsTrigger>
                <TabsTrigger value="tv">TV Shows</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>

              <TabsContent value="movies">
                <h2 className="text-xl font-semibold mb-4">Movie Appearances</h2>

                {sortedMovieCredits.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {sortedMovieCredits.slice(0, 12).map((movie: any) => (
                      <Link key={movie.id} href={`/movies/${movie.id}`}>
                        <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                          <div className="relative aspect-video bg-muted">
                            {movie.backdrop_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                                alt={movie.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center p-4">
                                <span className="text-muted-foreground text-center">{movie.title}</span>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-medium line-clamp-1">{movie.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {movie.character ? `as ${movie.character}` : "Role not specified"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {movie.release_date ? new Date(movie.release_date).getFullYear() : "Release date unknown"}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No movie appearances found.</p>
                )}

                {sortedMovieCredits.length > 12 && (
                  <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                      Showing 12 of {sortedMovieCredits.length} movie appearances
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tv">
                <h2 className="text-xl font-semibold mb-4">TV Show Appearances</h2>

                {sortedTvCredits.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {sortedTvCredits.slice(0, 12).map((show: any) => (
                      <Link key={show.id} href={`/tv/${show.id}`}>
                        <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                          <div className="relative aspect-video bg-muted">
                            {show.backdrop_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w500${show.backdrop_path}`}
                                alt={show.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center p-4">
                                <span className="text-muted-foreground text-center">{show.name}</span>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-medium line-clamp-1">{show.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {show.character ? `as ${show.character}` : "Role not specified"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {show.first_air_date
                                ? new Date(show.first_air_date).getFullYear()
                                : "Release date unknown"}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No TV show appearances found.</p>
                )}

                {sortedTvCredits.length > 12 && (
                  <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                      Showing 12 of {sortedTvCredits.length} TV show appearances
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="photos">
                <h2 className="text-xl font-semibold mb-4">Photos</h2>

                {person.images?.profiles?.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {person.images.profiles.map((image: any, index: number) => (
                      <div key={index} className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${image.file_path}`}
                          alt={`${person.name} photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No photos available.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </>
  )
}

