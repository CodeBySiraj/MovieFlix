import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch popular movies for sitemap
  const moviesRes = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
    { next: { revalidate: 86400 } },
  )
  const moviesData = await moviesRes.json()

  // Fetch popular TV shows for sitemap
  const tvRes = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
    { next: { revalidate: 86400 } },
  )
  const tvData = await tvRes.json()

  // Fetch popular people for sitemap
  const peopleRes = await fetch(
    `https://api.themoviedb.org/3/person/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
    { next: { revalidate: 86400 } },
  )
  const peopleData = await peopleRes.json()

  // Static routes
  const routes = [
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
    url: `https://movieflix.example.com${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // Movie routes
  const movieRoutes = moviesData.results.map((movie: any) => ({
    url: `https://movieflix.example.com/movies/${movie.id}`,
    lastModified: new Date(movie.release_date || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // TV routes
  const tvRoutes = tvData.results.map((show: any) => ({
    url: `https://movieflix.example.com/tv/${show.id}`,
    lastModified: new Date(show.first_air_date || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // People routes
  const peopleRoutes = peopleData.results.map((person: any) => ({
    url: `https://movieflix.example.com/person/${person.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...routes, ...movieRoutes, ...tvRoutes, ...peopleRoutes]
}

