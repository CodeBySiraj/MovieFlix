import { Suspense } from "react"
import { TvShowCard } from "@/components/tv-show-card"
import { Pagination } from "@/components/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SkeletonCard } from "@/components/skeleton-card"

async function getPopularTvShows(page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch popular TV shows")
  }

  return res.json()
}

async function getTopRatedTvShows(page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch top rated TV shows")
  }

  return res.json()
}

async function getAiringTodayTvShows(page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/airing_today?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch TV shows airing today")
  }

  return res.json()
}

async function getOnTheAirTvShows(page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch TV shows on the air")
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

async function TvShowsContent({ category, page }: { category: string; page: string }) {
  let tvShowsData
  const genresData = await getTvGenres()

  switch (category) {
    case "popular":
      tvShowsData = await getPopularTvShows(page)
      break
    case "top-rated":
      tvShowsData = await getTopRatedTvShows(page)
      break
    case "airing-today":
      tvShowsData = await getAiringTodayTvShows(page)
      break
    case "on-the-air":
      tvShowsData = await getOnTheAirTvShows(page)
      break
    default:
      tvShowsData = await getPopularTvShows(page)
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {tvShowsData.results.map((show: any) => (
          <TvShowCard key={show.id} show={show} genres={genresData.genres} />
        ))}
      </div>

      <Pagination
        currentPage={Number.parseInt(page)}
        totalPages={tvShowsData.total_pages > 500 ? 500 : tvShowsData.total_pages}
        baseUrl={`/tv?category=${category}&page=`}
      />
    </div>
  )
}

export default function TvShowsPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string }
}) {
  const category = searchParams.category || "popular"
  const page = searchParams.page || "1"

  const categoryTitles: Record<string, string> = {
    popular: "Popular TV Shows",
    "top-rated": "Top Rated TV Shows",
    "airing-today": "TV Shows Airing Today",
    "on-the-air": "TV Shows On The Air",
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{categoryTitles[category] || "TV Shows"}</h1>

      <Tabs defaultValue={category} className="w-full mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="popular" asChild>
            <a href="/tv?category=popular&page=1">Popular</a>
          </TabsTrigger>
          <TabsTrigger value="top-rated" asChild>
            <a href="/tv?category=top-rated&page=1">Top Rated</a>
          </TabsTrigger>
          <TabsTrigger value="airing-today" asChild>
            <a href="/tv?category=airing-today&page=1">Airing Today</a>
          </TabsTrigger>
          <TabsTrigger value="on-the-air" asChild>
            <a href="/tv?category=on-the-air&page=1">On The Air</a>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={category} className="mt-6">
          <Suspense fallback={<SkeletonGrid />}>
            <TvShowsContent category={category} page={page} />
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

