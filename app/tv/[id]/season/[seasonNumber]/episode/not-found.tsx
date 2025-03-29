import Link from "next/link"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Home, Tv, ArrowLeft, Film } from "lucide-react"

export default function EpisodeNotFound() {
  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
        <div className="relative">
          <Tv className="h-32 w-32 text-primary opacity-80" />
          <Film className="h-12 w-12 absolute bottom-0 right-0 text-primary opacity-80" />
        </div>
        <span className="absolute text-6xl font-bold">?</span>
      </div>

      <h1 className="text-4xl font-bold mb-4">Episode Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        We couldn't find the episode you're looking for. It might not exist or the ID is incorrect.
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
    </main>
  )
}

