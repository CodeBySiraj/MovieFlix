import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY
    if (!TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY is not defined in environment variables.")
    }

    const baseUrl = "https://movieflix.example.com"

    const fetchData = async (endpoint: string) => {
      const res = await fetch(
        `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        { next: { revalidate: 86400 } }
      )
      if (!res.ok) {
        console.error(`Failed to fetch ${endpoint}:`, res.status)
        return []
      }
      const data = await res.json()
      return data.results || []
    }

    const [movies, tvShows, people] = await Promise.all([
      fetchData("movie/popular"),
      fetchData("tv/popular"),
      fetchData("person/popular"),
    ])

    const staticRoutes: MetadataRoute.Sitemap = [
      "",
      "/movies/popular",
      "/movies/top-rated",
      "/movies/now-playing",
      "/movies/upcoming",
      "/movies/year",
      "/movies/awards",
      "/movies/collections",
      "/movies/discover",
      "/movies/languages",
      "/tv",
      "/trending",
      "/person/popular",
      "/search",
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.8,
    }))

    const movieRoutes = movies.map((movie: any) => ({
      url: `${baseUrl}/movies/${movie.id}`,
      lastModified: new Date(movie.release_date || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

    const tvRoutes = tvShows.map((show: any) => ({
      url: `${baseUrl}/tv/${show.id}`,
      lastModified: new Date(show.first_air_date || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

    const peopleRoutes = people.map((person: any) => ({
      url: `${baseUrl}/person/${person.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...movieRoutes, ...tvRoutes, ...peopleRoutes]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return []
  }
    }
