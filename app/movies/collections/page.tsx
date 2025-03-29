import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Featured collections - in a real app, you might fetch these from an API
const featuredCollections = [
  { id: 10, name: "Star Wars Collection", poster: "/poster-star-wars.jpg" },
  { id: 86311, name: "The Avengers Collection", poster: "/poster-avengers.jpg" },
  { id: 295, name: "Pirates of the Caribbean Collection", poster: "/poster-pirates.jpg" },
  { id: 2980, name: "The Lord of the Rings Collection", poster: "/poster-lotr.jpg" },
  { id: 87359, name: "Mission: Impossible Collection", poster: "/poster-mission-impossible.jpg" },
  { id: 645, name: "James Bond Collection", poster: "/poster-james-bond.jpg" },
  { id: 328, name: "Jurassic Park Collection", poster: "/poster-jurassic-park.jpg" },
  { id: 263, name: "The Dark Knight Collection", poster: "/poster-dark-knight.jpg" },
  { id: 87096, name: "John Wick Collection", poster: "/poster-john-wick.jpg" },
  { id: 531241, name: "The Conjuring Universe", poster: "/poster-conjuring.jpg" },
  { id: 131296, name: "The Hunger Games Collection", poster: "/poster-hunger-games.jpg" },
  { id: 9485, name: "The Fast and the Furious Collection", poster: "/poster-fast-furious.jpg" },
]

async function getCollection(collectionId: number) {
  const res = await fetch(
    `https://api.themoviedb.org/3/collection/${collectionId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 86400 } },
  )

  if (!res.ok) {
    console.error(`Failed to fetch collection with ID ${collectionId}`)
    return null
  }

  return res.json()
}

async function CollectionsGrid() {
  const collectionsPromises = featuredCollections.map((collection) => getCollection(collection.id))
  const collections = await Promise.all(collectionsPromises)
  const validCollections = collections.filter(Boolean)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {validCollections.map((collection: any) => (
        <Link key={collection.id} href={`/movies/collections/${collection.id}`}>
          <Card className="overflow-hidden h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
            <div className="relative aspect-video bg-muted">
              {collection.backdrop_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w780${collection.backdrop_path}`}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                  <span className="text-muted-foreground">{collection.name}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <Badge className="mb-2">Collection</Badge>
                <h3 className="text-white font-bold text-lg line-clamp-1">{collection.name}</h3>
                <p className="text-white/80 text-sm">{collection.parts?.length || 0} Movies</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function CollectionsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Movie Collections</h1>
      <p className="text-muted-foreground mb-8">Explore popular movie franchises and collections</p>

      <Suspense fallback={<CollectionsSkeletonGrid />}>
        <CollectionsGrid />
      </Suspense>
    </main>
  )
}

function CollectionsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index} className="overflow-hidden h-full">
          <div className="relative aspect-video bg-muted animate-pulse" />
          <CardContent className="p-4 space-y-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

