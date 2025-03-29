import Link from "next/link"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function SearchNotFound() {
  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
        <Search className="h-32 w-32 text-primary opacity-80" />
        <span className="absolute text-6xl font-bold">?</span>
      </div>

      <h1 className="text-4xl font-bold mb-4">Search Error</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        We encountered an issue with your search. Please try a different search term or browse our categories.
      </p>

      <div className="max-w-md w-full mb-10">
        <p className="mb-2 text-muted-foreground">Try searching for something else:</p>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <Button variant="default" size="lg" className="flex items-center gap-2" asChild>
          <Link href="/">
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2" asChild>
          <Link href="/movies/popular">Browse Movies</Link>
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2" asChild>
          <Link href="/tv">Browse TV Shows</Link>
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2" asChild>
          <Link href="/person/popular">Browse People</Link>
        </Button>
      </div>
    </main>
  )
}

