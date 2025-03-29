import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { MovieCard } from "@/components/movie-card"
import { SkeletonCard } from "@/components/skeleton-card"
import { ArrowLeft, Film } from "lucide-react"

async function getCollection(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/collection/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 86400 } },
  )

  if (!res.ok) {
    if (res.status === 404) {
      return notFound()
    }
    throw new Error("Failed to fetch collection")
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

async function CollectionContent({ id }: { id: string }) {
  const [collection, genresData] = await Promise.all([getCollection(id), getMovieGenres()])

  // Sort movies by release date
  const sortedMovies = [...collection.parts].sort((a, b) => {
    if (!a.release_date) return 1
    if (!b.release_date) return -1
    return new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
  })

  return (
    <>
      <div className="relative w-full h-[50vh] mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10" />
        <Image
          src={
            collection.backdrop_path
              ? `https://image.tmdb.org/t/p/original${collection.backdrop_path}`
              : "/placeholder.svg?height=1080&width=1920"
          }
          alt={collection.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 z-20 p-6 md:p-10 w-full md:w-2/3">
          <Link
            href="/movies/collections"
            className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">{collection.name}</h1>
          <p className="text-lg text-white/80 mb-4">{collection.parts.length} Movies</p>
        </div>
      </div>

      {collection.overview && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-muted-foreground">{collection.overview}</p>
        </div>
      )}

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Film className="h-6 w-6 mr-2 text-primary" />
          Movies in this Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedMovies.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} genres={genresData.genres} />
          ))}
        </div>
      </div>
    </>
  )
}

export default function CollectionPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<CollectionSkeleton />}>
        <CollectionContent id={params.id} />
      </Suspense>
    </main>
  )
}

function CollectionSkeleton() {
  return (
    <>
      <div className="relative w-full h-[50vh] mb-8 bg-muted animate-pulse">
        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3 space-y-4">
          <div className="h-4 w-32 bg-muted-foreground/20 rounded animate-pulse" />
          <div className="h-10 w-3/4 bg-muted-foreground/20 rounded animate-pulse" />
          <div className="h-6 w-40 bg-muted-foreground/20 rounded animate-pulse" />
        </div>
      </div>

      <div className="mb-10 space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
      </div>

      <div className="mb-10 space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </>
  )
}

