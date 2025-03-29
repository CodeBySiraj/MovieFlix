import { Suspense } from "react"
import Link from "next/link"
import { MovieCard } from "@/components/movie-card"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

async function YearContent({ year, page }: { year: string; page: string }) {
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
        baseUrl={`/movies/decade/${Number.parseInt(year) - (Number.parseInt(year) % 10)}?year=${year}&page=`}
      />
    </div>
  )
}

export default function DecadeMoviesPage({
  params,
  searchParams,
}: {
  params: { decade: string }
  searchParams: { year?: string; page?: string }
}) {
  const { decade } = params
  const decadeInt = Number.parseInt(decade)
  const years = Array.from({ length: 10 }, (_, i) => decadeInt + i)
  const selectedYear = searchParams.year || decade
  const page = searchParams.page || "1"

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/movies/year">
            <ArrowLeft className="h-4 w-4 mr-1" />
            All Decades
          </Link>
        </Button>

        <h1 className="text-3xl font-bold flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-primary" />
          Movies from the {decade}s
        </h1>
      </div>

      <Tabs defaultValue={selectedYear} className="w-full mb-8">
        <TabsList className="mb-6 flex flex-wrap h-auto">
          {years.map((year) => (
            <TabsTrigger key={year} value={year.toString()} asChild>
              <Link href={`/movies/decade/${decade}?year=${year}&page=1`}>{year}</Link>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedYear} className="mt-6">
          <Suspense fallback={<SkeletonGrid />}>
            <YearContent year={selectedYear} page={page} />
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

