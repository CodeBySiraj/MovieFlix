import Link from "next/link"
import Image from "next/image"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Home, Tv, ArrowLeft } from "lucide-react"

export default function TvNotFound() {
  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <Tv className="h-32 w-32 text-primary opacity-80" />
          <span className="absolute text-6xl font-bold">?</span>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4">TV Show Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        We couldn't find the TV show you're looking for. It might have been removed or the ID is incorrect.
      </p>

      <div className="max-w-md w-full mb-10">
        <p className="mb-2 text-muted-foreground">Try searching for a TV show:</p>
        <SearchBar />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        <Button variant="default" size="lg" className="flex items-center gap-2" asChild>
          <Link href="/tv">
            <ArrowLeft className="h-5 w-5" />
            Back to TV Shows
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2" asChild>
          <Link href="/">
            <Home className="h-5 w-5" />
            Home
          </Link>
        </Button>
      </div>

      <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-4xl">
        <TvSuggestion id="1399" title="Game of Thrones" />
        <TvSuggestion id="66732" title="Stranger Things" />
        <TvSuggestion id="1396" title="Breaking Bad" />
        <TvSuggestion id="60735" title="The Flash" />
        <TvSuggestion id="1402" title="The Walking Dead" />
      </div>
    </main>
  )
}

function TvSuggestion({ id, title }: { id: string; title: string }) {
  return (
    <Link href={`/tv/${id}`} className="group">
      <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden mb-2">
        <Image
          src={`https://image.tmdb.org/t/p/w300/${id}.jpg`}
          alt={title}
          fill
          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
      </div>
      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{title}</p>
    </Link>
  )
}

