import { Suspense } from "react"
import Link from "next/link"
import { MovieCard } from "@/components/movie-card"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { SkeletonCard } from "@/components/skeleton-card"
import { ArrowLeft, Calendar } from "lucide-react"

async function getMoviesByYear(year: string, page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&primary_release_year=${year}&page=${page}&sort_by=popularity.desc`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch movies by year")
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

async function MoviesContent({ year, page }: { year: string; page: string }) {
  const [moviesData, genresData] = await Promise.all([getMoviesByYear(year, page), getMovieGenres()])

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
        baseUrl={`/movies/year/${year}?page=`}
      />
    </div>
  )
}

export default function YearMoviesPage({
  params,
  searchParams,
}: {
  params: { year: string }
  searchParams: { page?: string }
}) {
  const { year } = params
  const page = searchParams.page || "1"

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/movies/year">
            <ArrowLeft className="h-4 w-4 mr-1" />
            All Years
          </Link>
        </Button>

        <h1 className="text-3xl font-bold flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-primary" />
          Movies from {year}
        </h1>
      </div>

      <Suspense fallback={<SkeletonGrid />}>
        <MoviesContent year={year} page={page} />
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

