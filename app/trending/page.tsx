import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieCard } from "@/components/movie-card"
import { TvShowCard } from "@/components/tv-show-card"
import { Pagination } from "@/components/pagination"
import { SkeletonCard } from "@/components/skeleton-card"

async function getTrendingMovies(timeWindow = "day", page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch trending movies")
  }

  return res.json()
}

async function getTrendingTvShows(timeWindow = "day", page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/tv/${timeWindow}?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch trending TV shows")
  }

  return res.json()
}

async function getTrendingPeople(timeWindow = "day", page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/person/${timeWindow}?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch trending people")
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

async function TrendingMoviesContent({ timeWindow, page }: { timeWindow: string; page: string }) {
  const [moviesData, genresData] = await Promise.all([getTrendingMovies(timeWindow, page), getMovieGenres()])

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {moviesData.results.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} genres={genresData.genres} />
        ))}
      </div>

      <Pagination
        currentPage={Number.parseInt(page)}
        totalPages={moviesData.total_pages > 500 ? 500 : moviesData.total_pages}
        baseUrl={`/trending?tab=movies&timeWindow=${timeWindow}&page=`}
      />
    </div>
  )
}

async function TrendingTvContent({ timeWindow, page }: { timeWindow: string; page: string }) {
  const [tvData, genresData] = await Promise.all([getTrendingTvShows(timeWindow, page), getTvGenres()])

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {tvData.results.map((show: any) => (
          <TvShowCard key={show.id} show={show} genres={genresData.genres} />
        ))}
      </div>

      <Pagination
        currentPage={Number.parseInt(page)}
        totalPages={tvData.total_pages > 500 ? 500 : tvData.total_pages}
        baseUrl={`/trending?tab=tv&timeWindow=${timeWindow}&page=`}
      />
    </div>
  )
}

async function TrendingPeopleContent({ timeWindow, page }: { timeWindow: string; page: string }) {
  const peopleData = await getTrendingPeople(timeWindow, page)

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
        {peopleData.results.map((person: any) => (
          <div key={person.id} className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden">
            <a href={`/person/${person.id}`} className="block h-full">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                  <span className="text-muted-foreground">{person.name}</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="font-medium text-white">{person.name}</h3>
                {person.known_for_department && <p className="text-xs text-white/70">{person.known_for_department}</p>}
              </div>
            </a>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={Number.parseInt(page)}
        totalPages={peopleData.total_pages > 500 ? 500 : peopleData.total_pages}
        baseUrl={`/trending?tab=people&timeWindow=${timeWindow}&page=`}
      />
    </div>
  )
}

export default function TrendingPage({
  searchParams,
}: {
  searchParams: { tab?: string; timeWindow?: string; page?: string }
}) {
  const tab = searchParams.tab || "movies"
  const timeWindow = searchParams.timeWindow || "day"
  const page = searchParams.page || "1"

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trending</h1>

      <Tabs defaultValue={tab} className="w-full mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="movies" asChild>
              <a href={`/trending?tab=movies&timeWindow=${timeWindow}&page=1`}>Movies</a>
            </TabsTrigger>
            <TabsTrigger value="tv" asChild>
              <a href={`/trending?tab=tv&timeWindow=${timeWindow}&page=1`}>TV Shows</a>
            </TabsTrigger>
            <TabsTrigger value="people" asChild>
              <a href={`/trending?tab=people&timeWindow=${timeWindow}&page=1`}>People</a>
            </TabsTrigger>
          </TabsList>

          <TabsList>
            <TabsTrigger value="day" asChild>
              <a href={`/trending?tab=${tab}&timeWindow=day&page=1`}>Today</a>
            </TabsTrigger>
            <TabsTrigger value="week" asChild>
              <a href={`/trending?tab=${tab}&timeWindow=week&page=1`}>This Week</a>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="movies" className="mt-6">
          <Suspense fallback={<SkeletonGrid />}>
            <TrendingMoviesContent timeWindow={timeWindow} page={page} />
          </Suspense>
        </TabsContent>

        <TabsContent value="tv" className="mt-6">
          <Suspense fallback={<SkeletonGrid />}>
            <TrendingTvContent timeWindow={timeWindow} page={page} />
          </Suspense>
        </TabsContent>

        <TabsContent value="people" className="mt-6">
          <Suspense fallback={<SkeletonGrid />}>
            <TrendingPeopleContent timeWindow={timeWindow} page={page} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
      {Array.from({ length: 20 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}

