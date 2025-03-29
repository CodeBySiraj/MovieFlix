import { MovieCard } from "@/components/movie-card"
import { TvShowCard } from "@/components/tv-show-card"

interface SimilarMediaProps {
  similar: any[] | undefined
  recommendations: any[] | undefined
  genres: {
    id: number
    name: string
  }[]
  type: "movie" | "tv"
}

export function SimilarMedia({ similar, recommendations, genres, type }: SimilarMediaProps) {
  const hasSimilar = similar && similar.length > 0
  const hasRecommendations = recommendations && recommendations.length > 0

  if (!hasSimilar && !hasRecommendations) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No similar content available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {hasSimilar && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Similar {type === "movie" ? "Movies" : "TV Shows"}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similar
              .slice(0, 10)
              .map((item) =>
                type === "movie" ? (
                  <MovieCard key={item.id} movie={item} genres={genres} />
                ) : (
                  <TvShowCard key={item.id} show={item} genres={genres} />
                ),
              )}
          </div>
        </div>
      )}

      {hasRecommendations && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations
              .slice(0, 10)
              .map((item) =>
                type === "movie" ? (
                  <MovieCard key={item.id} movie={item} genres={genres} />
                ) : (
                  <TvShowCard key={item.id} show={item} genres={genres} />
                ),
              )}
          </div>
        </div>
      )}
    </div>
  )
}

