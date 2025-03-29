import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get("id")
  const type = searchParams.get("type") || "movie"

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 3600 } },
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch videos: ${res.status}`)
    }

    const data = await res.json()

    // Find the first trailer, or teaser, or any video if no trailer is available
    const trailer =
      data.results.find((video: any) => video.type === "Trailer" && video.site === "YouTube") ||
      data.results.find((video: any) => video.type === "Teaser" && video.site === "YouTube") ||
      data.results.find((video: any) => video.site === "YouTube")

    if (trailer) {
      return NextResponse.json({ key: trailer.key })
    } else {
      return NextResponse.json({ error: "No trailer found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error fetching trailer:", error)
    return NextResponse.json({ error: "Failed to fetch trailer" }, { status: 500 })
  }
}

