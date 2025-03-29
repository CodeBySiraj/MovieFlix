import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { MovieCard } from "@/components/movie-card"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SkeletonCard } from "@/components/skeleton-card"
import { Award } from "lucide-react"

async function getOscarBestPictures() {
  // This is a simplified approach - in a real app, you'd have a more comprehensive database
  // of award winners or use a specialized API
  const oscarWinners = [
    { year: 2023, id: 674324, title: "Oppenheimer" },
    { year: 2022, id: 361743, title: "Everything Everywhere All at Once" },
    { year: 2021, id: 776503, title: "CODA" },
    { year: 2020, id: 581734, title: "Nomadland" },
    { year: 2019, id: 496243, title: "Parasite" },
    { year: 2018, id: 490132, title: "Green Book" },
    { year: 2017, id: 399055, title: "The Shape of Water" },
    { year: 2016, id: 376867, title: "Moonlight" },
    { year: 2015, id: 314365, title: "Spotlight" },
    { year: 2014, id: 194662, title: "Birdman" },
  ]

  const moviePromises = oscarWinners.map(async (winner) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${winner.id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } },
    )

    if (!res.ok) {
      console.error(`Failed to fetch movie with ID ${winner.id}`)
      return null
    }

    const movie = await res.json()
    return { ...movie, oscar_year: winner.year }
  })

  const movies = await Promise.all(moviePromises)
  return movies.filter(Boolean)
}

async function getTopRatedMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch top rated movies")
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

async function OscarWinnersSection() {
  const [oscarWinners, genresData] = await Promise.all([getOscarBestPictures(), getMovieGenres()])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Award className="h-6 w-6 mr-2 text-amber-500" />
        Academy Award Best Picture Winners
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {oscarWinners.map((movie: any) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            <Card className="overflow-hidden h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg border-amber-500/20 hover:border-amber-500">
              <div className="relative aspect-[2/3] bg-muted">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                    <span className="text-muted-foreground">{movie.title}</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {movie.oscar_year}
                  </span>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium line-clamp-1">{movie.title}</h3>
                <p className="text-xs text-amber-500 font-medium">Best Picture Winner</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

async function CriticallyAcclaimedSection() {
  const [topRatedData, genresData] = await Promise.all([getTopRatedMovies(), getMovieGenres()])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Critically Acclaimed Movies</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {topRatedData.results.slice(0, 10).map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} genres={genresData.genres} />
        ))}
      </div>
    </div>
  )
}

export default function AwardsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Award-Winning Movies</h1>

      <Tabs defaultValue="oscars" className="w-full mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="oscars">Oscars</TabsTrigger>
          <TabsTrigger value="acclaimed">Critically Acclaimed</TabsTrigger>
        </TabsList>

        <TabsContent value="oscars" className="mt-6">
          <Suspense fallback={<SkeletonGrid />}>
            <OscarWinnersSection />
          </Suspense>
        </TabsContent>

        <TabsContent value="acclaimed" className="mt-6">
          <Suspense fallback={<SkeletonGrid />}>
            <CriticallyAcclaimedSection />
          </Suspense>
        </TabsContent>
      </Tabs>

      <div className="mt-12 p-6 bg-card rounded-lg border">
        <h2 className="text-xl font-bold mb-4">About Movie Awards</h2>
        <p className="text-muted-foreground mb-4">
          The Academy Awards, also known as the Oscars, are the most prestigious awards in the film industry. The Best
          Picture award is presented annually by the Academy of Motion Picture Arts and Sciences to the producers of the
          film deemed the best feature-length motion picture of the year.
        </p>
        <p className="text-muted-foreground">
          This page showcases recent Best Picture winners and other critically acclaimed films that have received
          recognition for their exceptional storytelling, direction, acting, and technical achievements.
        </p>
      </div>
    </main>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
      {Array.from({ length: 10 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}

function MovieSuggestion({ id, title }: { id: string; title: string }) {
  return (
    <Link href={`/movies/${id}`} className="group">
      <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden mb-2">
        <Image
          src={`https://image.tmdb.org/t/p/w300/${id}.jpg`}
          alt={title}
          fill
          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
      </div>
      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{title}</p>
    </Link>
  )
}

