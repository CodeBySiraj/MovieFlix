import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } },
    )

    if (!res.ok) {
      throw new Error(`TMDB API error: ${res.status}`)
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching genres from TMDB:", error)
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 })
  }
}

