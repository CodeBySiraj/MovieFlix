"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from "@/components/pagination"
import { SkeletonCard } from "@/components/skeleton-card"
import { Filter, Search, SlidersHorizontal, X } from "lucide-react"

// Sort options
const sortOptions = [
  { value: "popularity.desc", label: "Popularity Descending" },
  { value: "popularity.asc", label: "Popularity Ascending" },
  { value: "vote_average.desc", label: "Rating Descending" },
  { value: "vote_average.asc", label: "Rating Ascending" },
  { value: "primary_release_date.desc", label: "Release Date Descending" },
  { value: "primary_release_date.asc", label: "Release Date Ascending" },
  { value: "revenue.desc", label: "Revenue Descending" },
  { value: "revenue.asc", label: "Revenue Ascending" },
]

// Year range
const currentYear = new Date().getFullYear()
const yearRange = Array.from({ length: 80 }, (_, i) => currentYear - i)

export default function DiscoverPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Filter states
  const [genres, setGenres] = useState<any[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "popularity.desc")
  const [yearFrom, setYearFrom] = useState(searchParams.get("year_from") || (currentYear - 10).toString())
  const [yearTo, setYearTo] = useState(searchParams.get("year_to") || currentYear.toString())
  const [voteAverage, setVoteAverage] = useState<number[]>([Number(searchParams.get("vote_average") || 0)])
  const [withOriginalLanguage, setWithOriginalLanguage] = useState(searchParams.get("with_original_language") || "")

  // Results states
  const [movies, setMovies] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page") || 1))
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(`/api/genres/movie`)
        if (res.ok) {
          const data = await res.json()
          setGenres(data.genres)

          // Initialize selected genres from URL
          const genresParam = searchParams.get("with_genres")
          if (genresParam) {
            setSelectedGenres(genresParam.split(","))
          }
        }
      } catch (error) {
        console.error("Failed to fetch genres:", error)
      }
    }

    fetchGenres()
  }, [searchParams])

  // Fetch movies based on filters
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)

      try {
        // Build query params
        const params = new URLSearchParams()
        params.append("sort_by", sortBy)
        params.append("page", currentPage.toString())

        if (selectedGenres.length > 0) {
          params.append("with_genres", selectedGenres.join(","))
        }

        if (yearFrom) {
          params.append("primary_release_date.gte", `${yearFrom}-01-01`)
        }

        if (yearTo) {
          params.append("primary_release_date.lte", `${yearTo}-12-31`)
        }

        if (voteAverage[0] > 0) {
          params.append("vote_average.gte", voteAverage[0].toString())
        }

        if (withOriginalLanguage) {
          params.append("with_original_language", withOriginalLanguage)
        }

        const res = await fetch(`/api/discover/movie?${params.toString()}`)

        if (res.ok) {
          const data = await res.json()
          setMovies(data.results)
          setTotalPages(data.total_pages > 500 ? 500 : data.total_pages)
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [sortBy, selectedGenres, yearFrom, yearTo, voteAverage, withOriginalLanguage, currentPage])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    params.append("sort_by", sortBy)
    params.append("page", currentPage.toString())

    if (selectedGenres.length > 0) {
      params.append("with_genres", selectedGenres.join(","))
    }

    if (yearFrom) {
      params.append("year_from", yearFrom)
    }

    if (yearTo) {
      params.append("year_to", yearTo)
    }

    if (voteAverage[0] > 0) {
      params.append("vote_average", voteAverage[0].toString())
    }

    if (withOriginalLanguage) {
      params.append("with_original_language", withOriginalLanguage)
    }

    router.push(`/movies/discover?${params.toString()}`, { scroll: false })
  }, [sortBy, selectedGenres, yearFrom, yearTo, voteAverage, withOriginalLanguage, currentPage, router])

  // Handle genre toggle
  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) => (prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]))
    setCurrentPage(1)
  }

  // Handle filter changes
  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const handleYearFromChange = (value: string) => {
    setYearFrom(value)
    setCurrentPage(1)
  }

  const handleYearToChange = (value: string) => {
    setYearTo(value)
    setCurrentPage(1)
  }

  const handleVoteAverageChange = (value: number[]) => {
    setVoteAverage(value)
    setCurrentPage(1)
  }

  const handleLanguageChange = (value: string) => {
    setWithOriginalLanguage(value)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSortBy("popularity.desc")
    setSelectedGenres([])
    setYearFrom((currentYear - 10).toString())
    setYearTo(currentYear.toString())
    setVoteAverage([0])
    setWithOriginalLanguage("")
    setCurrentPage(1)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Discover Movies</h1>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
            {showFilters ? <X className="h-4 w-4 mr-1" /> : <Filter className="h-4 w-4 mr-1" />}
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>

          <Button variant="outline" size="sm" onClick={resetFilters}>
            <X className="h-4 w-4 mr-1" />
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Filters sidebar */}
        <div className={`md:block ${showFilters ? "block" : "hidden"}`}>
          <div className="bg-card rounded-lg border p-4 space-y-6">
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                Sort By
              </h3>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-2">Genres</h3>
              <div className="grid grid-cols-2 gap-2">
                {genres.map((genre) => (
                  <div key={genre.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre.id}`}
                      checked={selectedGenres.includes(genre.id.toString())}
                      onCheckedChange={() => toggleGenre(genre.id.toString())}
                    />
                    <label htmlFor={`genre-${genre.id}`} className="text-sm cursor-pointer">
                      {genre.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Release Year</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">From</label>
                  <Select value={yearFrom} onValueChange={handleYearFromChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearRange.map((year) => (
                        <SelectItem key={`from-${year}`} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">To</label>
                  <Select value={yearTo} onValueChange={handleYearToChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearRange.map((year) => (
                        <SelectItem key={`to-${year}`} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Minimum Rating</h3>
              <div className="px-2">
                <Slider value={voteAverage} min={0} max={10} step={0.5} onValueChange={handleVoteAverageChange} />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>0</span>
                  <span>{voteAverage[0]}</span>
                  <span>10</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Language</h3>
              <Select value={withOriginalLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} genres={genres} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={`/movies/discover?sort_by=${sortBy}&page=`}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">No movies found</h2>
              <p className="text-muted-foreground mb-4">Try adjusting your filters to find what you're looking for</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

