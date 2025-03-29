import { MovieCard } from "@/components/movie-card"
import { TvShowCard } from "@/components/tv-show-card"
import { PersonCard } from "@/components/person-card"
import { SearchBar } from "@/components/search-bar"
import { Pagination } from "@/components/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

async function multiSearch(query: string, page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${query}&page=${page}`,
    { next: { revalidate: 60 } },
  )

  if (!res.ok) {
    throw new Error("Failed to search")
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string }
}) {
  const query = searchParams.query || ""
  const page = searchParams.page || "1"

  let searchResults = null
  const [movieGenresData, tvGenresData] = await Promise.all([getMovieGenres(), getTvGenres()])

  if (query) {
    searchResults = await multiSearch(query, page)
  }

  // Group results by media type
  const movies = searchResults?.results.filter((item: any) => item.media_type === "movie") || []
  const tvShows = searchResults?.results.filter((item: any) => item.media_type === "tv") || []
  const people = searchResults?.results.filter((item: any) => item.media_type === "person") || []

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        <SearchBar defaultValue={query} />
      </div>

      {query && searchResults ? (
        <>
          <div className="mb-6">
            <p className="text-muted-foreground">
              Found {searchResults.total_results} results for "{query}"
            </p>
          </div>

          {searchResults.results.length > 0 ? (
            <>
              <Tabs defaultValue="all" className="w-full mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Results</TabsTrigger>
                  <TabsTrigger value="movies">Movies ({movies.length})</TabsTrigger>
                  <TabsTrigger value="tv">TV Shows ({tvShows.length})</TabsTrigger>
                  <TabsTrigger value="people">People ({people.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {searchResults.results.map((item: any) => {
                      if (item.media_type === "movie") {
                        return <MovieCard key={item.id} movie={item} genres={movieGenresData.genres} />
                      } else if (item.media_type === "tv") {
                        return <TvShowCard key={item.id} show={item} genres={tvGenresData.genres} />
                      } else if (item.media_type === "person") {
                        return <PersonCard key={item.id} person={item} />
                      }
                      return null
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="movies" className="mt-6">
                  {movies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {movies.map((movie: any) => (
                        <MovieCard key={movie.id} movie={movie} genres={movieGenresData.genres} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-10 text-muted-foreground">No movies found matching your search.</p>
                  )}
                </TabsContent>

                <TabsContent value="tv" className="mt-6">
                  {tvShows.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {tvShows.map((show: any) => (
                        <TvShowCard key={show.id} show={show} genres={tvGenresData.genres} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-10 text-muted-foreground">No TV shows found matching your search.</p>
                  )}
                </TabsContent>

                <TabsContent value="people" className="mt-6">
                  {people.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {people.map((person: any) => (
                        <PersonCard key={person.id} person={person} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-10 text-muted-foreground">No people found matching your search.</p>
                  )}
                </TabsContent>
              </Tabs>

              <Pagination
                currentPage={Number.parseInt(page)}
                totalPages={searchResults.total_pages > 500 ? 500 : searchResults.total_pages}
                baseUrl={`/search?query=${query}&page=`}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">No results found</h2>
              <p className="text-muted-foreground">
                We couldn't find any movies, TV shows, or people matching "{query}"
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Search for movies, TV shows, and people</h2>
          <p className="text-muted-foreground">Enter a search term in the box above to find what you're looking for</p>
        </div>
      )}
    </main>
  )
}

