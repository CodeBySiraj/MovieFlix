import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Pagination } from "@/components/pagination"
import { SkeletonCard } from "@/components/skeleton-card"

async function getPopularPeople(page = "1") {
  const res = await fetch(
    `https://api.themoviedb.org/3/person/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch popular people")
  }

  return res.json()
}

async function PeopleContent({ page }: { page: string }) {
  const peopleData = await getPopularPeople(page)

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
        {peopleData.results.map((person: any) => (
          <Link key={person.id} href={`/person/${person.id}`}>
            <Card className="overflow-hidden h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
              <div className="relative aspect-[2/3] bg-muted">
                {person.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                    alt={person.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                    <span className="text-muted-foreground">{person.name}</span>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium line-clamp-1">{person.name}</h3>
                {person.known_for_department && (
                  <p className="text-xs text-muted-foreground">{person.known_for_department}</p>
                )}
                {person.known_for && person.known_for.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    Known for: {person.known_for.map((work: any) => work.title || work.name).join(", ")}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={Number.parseInt(page)}
        totalPages={peopleData.total_pages > 500 ? 500 : peopleData.total_pages}
        baseUrl={`/person/popular?page=`}
      />
    </div>
  )
}

export default function PopularPeoplePage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams.page || "1"

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Popular People</h1>
      <p className="text-muted-foreground mb-8">
        Discover popular actors, directors, and other film industry professionals
      </p>

      <Suspense fallback={<SkeletonGrid />}>
        <PeopleContent page={page} />
      </Suspense>
    </main>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
      {Array.from({ length: 20 }).map((_, index) => (
        <SkeletonCard key={index} variant="person" />
      ))}
    </div>
  )
}

