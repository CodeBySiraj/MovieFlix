import { notFound } from "next/navigation"
import { MovieCard } from "@/components/movie-card"
import { Pagination } from "@/components/pagination"

async function getMoviesByGenre(genreId: string, page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch movies by genre")
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

export default async function GenrePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { page?: string }
}) {
  const page = searchParams.page || "1"
  const [moviesData, genresData] = await Promise.all([getMoviesByGenre(params.id, page), getMovieGenres()])

  const genre = genresData.genres.find((g: any) => g.id.toString() === params.id)

  if (!genre) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{genre.name} Movies</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {moviesData.results.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} genres={genresData.genres} />
        ))}
      </div>

      <Pagination
        currentPage={Number.parseInt(page)}
        totalPages={moviesData.total_pages > 500 ? 500 : moviesData.total_pages}
        baseUrl={`/genre/${params.id}?page=`}
      />
    </main>
  )
}

