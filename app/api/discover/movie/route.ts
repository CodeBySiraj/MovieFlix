import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // Build TMDB API query params
  const tmdbParams = new URLSearchParams()

  // Add API key
  tmdbParams.append("api_key", process.env.TMDB_API_KEY || "")
  tmdbParams.append("language", "en-US")

  // Copy over relevant params
  const paramsToCopy = [
    "sort_by",
    "page",
    "with_genres",
    "with_original_language",
    "vote_average.gte",
    "vote_count.gte",
  ]

  paramsToCopy.forEach((param) => {
    const value = searchParams.get(param)
    if (value) {
      tmdbParams.append(param, value)
    }
  })

  // Handle date ranges
  const yearFrom = searchParams.get("primary_release_date.gte")
  if (yearFrom) {
    tmdbParams.append("primary_release_date.gte", yearFrom)
  }

  const yearTo = searchParams.get("primary_release_date.lte")
  if (yearTo) {
    tmdbParams.append("primary_release_date.lte", yearTo)
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${tmdbParams.toString()}`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      throw new Error(`TMDB API error: ${res.status}`)
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching from TMDB:", error)
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 })
  }
}

