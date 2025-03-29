import Link from "next/link"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Home, Tag, ArrowLeft, Tv } from "lucide-react"

export default function TvGenreNotFound() {
  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
        <div className="relative">
          <Tag className="h-32 w-32 text-primary opacity-80" />
          <Tv className="h-12 w-12 absolute bottom-0 right-0 text-primary opacity-80" />
        </div>
        <span className="absolute text-6xl font-bold">?</span>
      </div>

      <h1 className="text-4xl font-bold mb-4">TV Genre Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        We couldn't find the TV genre you're looking for. It might have been removed or the ID is incorrect.
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

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl">
        <GenreButton id="10759" name="Action & Adventure" />
        <GenreButton id="16" name="Animation" />
        <GenreButton id="35" name="Comedy" />
        <GenreButton id="80" name="Crime" />
        <GenreButton id="99" name="Documentary" />
        <GenreButton id="18" name="Drama" />
        <GenreButton id="10751" name="Family" />
        <GenreButton id="10762" name="Kids" />
        <GenreButton id="9648" name="Mystery" />
        <GenreButton id="10763" name="News" />
        <GenreButton id="10764" name="Reality" />
        <GenreButton id="10765" name="Sci-Fi & Fantasy" />
      </div>
    </main>
  )
}

function GenreButton({ id, name }: { id: string; name: string }) {
  return (
    <Button variant="outline" className="w-full" asChild>
      <Link href={`/tv/genre/${id}`}>{name}</Link>
    </Button>
  )
}

