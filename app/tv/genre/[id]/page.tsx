import { notFound } from "next/navigation"
import { TvShowCard } from "@/components/tv-show-card"
import { Pagination } from "@/components/pagination"

async function getTvShowsByGenre(genreId: string, page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&language=en-US&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch TV shows by genre")
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

export default async function TvGenrePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { page?: string }
}) {
  const page = searchParams.page || "1"
  const [tvShowsData, genresData] = await Promise.all([getTvShowsByGenre(params.id, page), getTvGenres()])

  const genre = genresData.genres.find((g: any) => g.id.toString() === params.id)

  if (!genre) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{genre.name} TV Shows</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {tvShowsData.results.map((show: any) => (
          <TvShowCard key={show.id} show={show} genres={genresData.genres} />
        ))}
      </div>

      <Pagination
        currentPage={Number.parseInt(page)}
        totalPages={tvShowsData.total_pages > 500 ? 500 : tvShowsData.total_pages}
        baseUrl={`/tv/genre/${params.id}?page=`}
      />
    </main>
  )
}

