import Link from "next/link"
import Image from "next/image"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Home, Film, Tv, Users } from "lucide-react"

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <div className="relative w-64 h-64 mb-8">
        <Image src="/placeholder.svg?height=256&width=256" alt="404 Not Found" fill className="object-contain" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-9xl font-bold text-primary opacity-80">404</span>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        We couldn't find the page you're looking for. It might have been moved or deleted.
      </p>

      <div className="max-w-md w-full mb-10">
        <p className="mb-2 text-muted-foreground">Try searching for something:</p>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
        <Button variant="outline" size="lg" className="flex items-center gap-2" asChild>
          <Link href="/">
            <Home className="h-5 w-5" />
            Home
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2" asChild>
          <Link href="/movies/popular">
            <Film className="h-5 w-5" />
            Movies
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2" asChild>
          <Link href="/tv">
            <Tv className="h-5 w-5" />
            TV Shows
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2" asChild>
          <Link href="/person/popular">
            <Users className="h-5 w-5" />
            People
          </Link>
        </Button>
      </div>
    </main>
  )
}

