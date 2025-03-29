import Link from "next/link"
import Image from "next/image"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Home, Users, ArrowLeft } from "lucide-react"

export default function PersonNotFound() {
  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <Users className="h-32 w-32 text-primary opacity-80" />
          <span className="absolute text-6xl font-bold">?</span>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4">Person Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        We couldn't find the person you're looking for. They might not be in our database or the ID is incorrect.
      </p>

      <div className="max-w-md w-full mb-10">
        <p className="mb-2 text-muted-foreground">Try searching for someone:</p>
        <SearchBar />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        <Button variant="default" size="lg" className="flex items-center gap-2" asChild>
          <Link href="/person/popular">
            <ArrowLeft className="h-5 w-5" />
            Popular People
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
        <PersonSuggestion id="287" title="Brad Pitt" />
        <PersonSuggestion id="1136406" title="Tom Holland" />
        <PersonSuggestion id="6193" title="Leonardo DiCaprio" />
        <PersonSuggestion id="1245" title="Scarlett Johansson" />
        <PersonSuggestion id="74568" title="Chris Hemsworth" />
      </div>
    </main>
  )
}

function PersonSuggestion({ id, title }: { id: string; title: string }) {
  return (
    <Link href={`/person/${id}`} className="group">
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

