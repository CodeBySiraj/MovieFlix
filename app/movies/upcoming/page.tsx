import { Suspense } from "react"
import { MovieCard } from "@/components/movie-card"
import { Pagination } from "@/components/pagination"
import { SkeletonCard } from "@/components/skeleton-card"

async function getUpcomingMovies(page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}&region=US`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch upcoming movies")
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

async function MoviesContent({ page }: { page: string }) {
  const [moviesData, genresData] = await Promise.all([getUpcomingMovies(page), getMovieGenres()])

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
        baseUrl={`/movies/upcoming?page=`}
      />
    </div>
  )
}

export default function UpcomingMoviesPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams.page || "1"

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Movies</h1>
      <p className="text-muted-foreground mb-8">Movies coming soon to theaters</p>

      <Suspense fallback={<SkeletonGrid />}>
        <MoviesContent page={page} />
      </Suspense>
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

