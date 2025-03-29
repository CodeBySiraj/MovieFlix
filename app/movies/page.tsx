import { Suspense } from "react"
import Link from "next/link"
import { MovieCard } from "@/components/movie-card"
import { CategoryFilter } from "@/components/category-filter"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SkeletonCarousel } from "@/components/skeleton-carousel"
import { MediaCarousel } from "@/components/media-carousel"
import { ArrowRight, Award, Calendar, Film, Popcorn, Star, TrendingUp, Globe } from "lucide-react"

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

async function getMoviesByLanguage(language: string, page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&with_original_language=${language}&page=${page}&sort_by=popularity.desc`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch movies by language")
  }

  return res.json()
}

async function GenreSection({
  genreId,
  genreName,
  genresData,
}: { genreId: string; genreName: string; genresData: any }) {
  const moviesData = await getMoviesByGenre(genreId, "1")

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{genreName} Movies</h2>
        <Button variant="link" asChild>
          <Link href={`/genre/${genreId}`}>
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {moviesData.results.slice(0, 5).map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} genres={genresData.genres} />
        ))}
      </div>
    </div>
  )
}

async function YearSection({ year, genresData }: { year: string; genresData: any }) {
  const moviesData = await getMoviesByYear(year, "1")

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{year} Movies</h2>
        <Button variant="link" asChild>
          <Link href={`/movies/year/${year}`}>
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <MediaCarousel items={moviesData.results} genres={genresData.genres} type="movie" />
    </div>
  )
}

async function LanguageSection({
  language,
  languageName,
  genresData,
}: { language: string; languageName: string; genresData: any }) {
  const moviesData = await getMoviesByLanguage(language, "1")

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{languageName} Movies</h2>
        <Button variant="link" asChild>
          <Link href={`/movies/language/${language}`}>
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <MediaCarousel items={moviesData.results} genres={genresData.genres} type="movie" />
    </div>
  )
}

export default async function MoviesPage() {
  const genresData = await getMovieGenres()

  // Featured genres
  const featuredGenres = [
    { id: "28", name: "Action" },
    { id: "35", name: "Comedy" },
    { id: "18", name: "Drama" },
    { id: "27", name: "Horror" },
    { id: "10749", name: "Romance" },
    { id: "878", name: "Science Fiction" },
  ]

  // Featured years
  const currentYear = new Date().getFullYear()

  // Featured languages
  const languages = [
    { code: "en", name: "English" },
    { code: "ko", name: "Korean" },
    { code: "ja", name: "Japanese" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Movies</h1>

      {/* Categories Filter */}
      <div className="mb-8">
        <CategoryFilter categories={genresData.genres} type="movie" />
      </div>

      {/* Featured Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <Link href="/movies/popular" className="group">
          <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg border-primary/20 hover:border-primary">
            <div className="relative aspect-video bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center">
              <TrendingUp className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Popular Movies</h3>
              <p className="text-sm text-muted-foreground">Trending and popular movies right now</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/movies/top-rated" className="group">
          <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg border-yellow-500/20 hover:border-yellow-500">
            <div className="relative aspect-video bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 flex items-center justify-center">
              <Star className="h-12 w-12 text-yellow-500 group-hover:scale-110 transition-transform" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg group-hover:text-yellow-500 transition-colors">Top Rated</h3>
              <p className="text-sm text-muted-foreground">Highest rated movies of all time</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/movies/now-playing" className="group">
          <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg border-green-500/20 hover:border-green-500">
            <div className="relative aspect-video bg-gradient-to-r from-green-500/20 to-green-500/5 flex items-center justify-center">
              <Popcorn className="h-12 w-12 text-green-500 group-hover:scale-110 transition-transform" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg group-hover:text-green-500 transition-colors">Now Playing</h3>
              <p className="text-sm text-muted-foreground">Movies currently in theaters</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/movies/upcoming" className="group">
          <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg border-blue-500/20 hover:border-blue-500">
            <div className="relative aspect-video bg-gradient-to-r from-blue-500/20 to-blue-500/5 flex items-center justify-center">
              <Calendar className="h-12 w-12 text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg group-hover:text-blue-500 transition-colors">Upcoming</h3>
              <p className="text-sm text-muted-foreground">Movies coming soon to theaters</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/movies/year" className="group">
          <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg border-purple-500/20 hover:border-purple-500">
            <div className="relative aspect-video bg-gradient-to-r from-purple-500/20 to-purple-500/5 flex items-center justify-center">
              <Film className="h-12 w-12 text-purple-500 group-hover:scale-110 transition-transform" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg group-hover:text-purple-500 transition-colors">By Year</h3>
              <p className="text-sm text-muted-foreground">Browse movies by release year</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/movies/languages" className="group">
          <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg border-teal-500/20 hover:border-teal-500">
            <div className="relative aspect-video bg-gradient-to-r from-teal-500/20 to-teal-500/5 flex items-center justify-center">
              <Globe className="h-12 w-12 text-teal-500 group-hover:scale-110 transition-transform" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg group-hover:text-teal-500 transition-colors">International</h3>
              <p className="text-sm text-muted-foreground">Explore films from around the world</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/movies/awards" className="group">
          <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg border-amber-500/20 hover:border-amber-500">
            <div className="relative aspect-video bg-gradient-to-r from-amber-500/20 to-amber-500/5 flex items-center justify-center">
              <Award className="h-12 w-12 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg group-hover:text-amber-500 transition-colors">Award Winners</h3>
              <p className="text-sm text-muted-foreground">Oscar and other award-winning films</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Popular Movies Section */}
      <Suspense fallback={<SkeletonCarousel count={5} />}>
        <PopularMoviesSection genresData={genresData} />
      </Suspense>

      {/* Movies by Genre */}
      <div className="my-12">
        <h2 className="text-3xl font-bold mb-6">Movies by Genre</h2>
        <div className="space-y-12">
          {featuredGenres.map((genre) => (
            <Suspense key={genre.id} fallback={<SkeletonCarousel count={5} />}>
              <GenreSection genreId={genre.id} genreName={genre.name} genresData={genresData} />
            </Suspense>
          ))}
        </div>
      </div>

      {/* Movies by Year */}
      <div className="my-12">
        <h2 className="text-3xl font-bold mb-6">Movies by Year</h2>
        <div className="space-y-12">
          {[currentYear, currentYear - 1, currentYear - 2].map((year) => (
            <Suspense key={year} fallback={<SkeletonCarousel count={5} />}>
              <YearSection year={year.toString()} genresData={genresData} />
            </Suspense>
          ))}
        </div>
      </div>

      {/* Movies by Language */}
      <div className="my-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">International Cinema</h2>
          <Button variant="outline" asChild>
            <Link href="/movies/languages">
              View All Languages <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="space-y-12">
          {languages.slice(1, 4).map((language) => (
            <Suspense key={language.code} fallback={<SkeletonCarousel count={5} />}>
              <LanguageSection language={language.code} languageName={language.name} genresData={genresData} />
            </Suspense>
          ))}
        </div>
      </div>
    </main>
  )
}

async function PopularMoviesSection({ genresData }: { genresData: any }) {
  const moviesData = await getPopularMovies()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Popular Movies</h2>
        <Button variant="link" asChild>
          <Link href="/movies/popular">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {moviesData.results.slice(0, 10).map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} genres={genresData.genres} />
        ))}
      </div>
    </div>
  )
}

