import { Suspense } from "react"
import { SearchBar } from "@/components/search-bar"
import { CategoryFilter } from "@/components/category-filter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeroSection } from "@/components/hero-section"
import { MediaCarousel } from "@/components/media-carousel"
import { SkeletonCarousel } from "@/components/skeleton-carousel"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MovieFlix - Discover Movies and TV Shows",
  description:
    "Browse and discover the latest movies and TV shows. Find information about trending titles, popular actors, and more.",
  keywords: ["movies", "tv shows", "films", "cinema", "actors", "trending", "popular", "watch", "stream"],
  alternates: {
    canonical: "https://movieflix.example.com",
  },
}

async function getTrendingMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch trending movies")
  }

  return res.json()
}

async function getPopularMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch popular movies")
  }

  return res.json()
}

async function getUpcomingMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1&region=US`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch upcoming movies")
  }

  return res.json()
}

async function getNowPlayingMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1&region=US`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch now playing movies")
  }

  return res.json()
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

async function getPopularTvShows() {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch popular TV shows")
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

// Carousel section component with suspense
async function CarouselSection({
  fetchFn,
  title,
  type,
  viewAllLink,
  genresData,
  featuredIndex = -1,
}: {
  fetchFn: () => Promise<any>
  title: string
  type: "movie" | "tv"
  viewAllLink: string
  genresData: any
  featuredIndex?: number
}) {
  const data = await fetchFn()

  return (
    <MediaCarousel
      items={data.results}
      genres={genresData.genres}
      type={type}
      title={title}
      viewAllLink={viewAllLink}
      featuredIndex={featuredIndex}
    />
  )
}

export default async function Home() {
  // Fetch hero data and genres immediately
  const [trendingData, movieGenresData, tvGenresData] = await Promise.all([
    getTrendingMovies(),
    getMovieGenres(),
    getTvGenres(),
  ])

  // Get the first trending movie for the hero section
  const heroMovie = trendingData.results[0]

  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection movie={heroMovie} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">Explore</h2>
            <SearchBar />
          </div>

          <Tabs defaultValue="movies" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="tv">TV Shows</TabsTrigger>
            </TabsList>

            <TabsContent value="movies">
              <CategoryFilter categories={movieGenresData.genres} type="movie" />
            </TabsContent>

            <TabsContent value="tv">
              <CategoryFilter categories={tvGenresData.genres} type="tv" />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-12">
          <Suspense fallback={<SkeletonCarousel count={6} variant="movie" />}>
            <CarouselSection
              fetchFn={getTrendingMovies}
              title="Trending Today"
              type="movie"
              viewAllLink="/trending"
              genresData={movieGenresData}
              featuredIndex={1}
            />
          </Suspense>

          <Suspense fallback={<SkeletonCarousel count={6} variant="movie" />}>
            <CarouselSection
              fetchFn={getNowPlayingMovies}
              title="Now Playing"
              type="movie"
              viewAllLink="/movies/now-playing"
              genresData={movieGenresData}
            />
          </Suspense>

          <Suspense fallback={<SkeletonCarousel count={6} variant="movie" />}>
            <CarouselSection
              fetchFn={getUpcomingMovies}
              title="Upcoming Movies"
              type="movie"
              viewAllLink="/movies/upcoming"
              genresData={movieGenresData}
            />
          </Suspense>

          <Suspense fallback={<SkeletonCarousel count={6} variant="movie" />}>
            <CarouselSection
              fetchFn={getTopRatedMovies}
              title="Top Rated Movies"
              type="movie"
              viewAllLink="/movies/top-rated"
              genresData={movieGenresData}
            />
          </Suspense>

          <Suspense fallback={<SkeletonCarousel count={6} variant="tv" />}>
            <CarouselSection
              fetchFn={getPopularTvShows}
              title="Popular TV Shows"
              type="tv"
              viewAllLink="/tv"
              genresData={tvGenresData}
            />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

