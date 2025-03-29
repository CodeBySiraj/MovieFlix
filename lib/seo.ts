// SEO utility functions for generating metadata and structured data

type MovieStructuredData = {
  title: string
  description: string
  image?: string
  datePublished?: string
  director?: string
  genre?: string[]
  duration?: string
  rating?: number
  url: string
}

type TVShowStructuredData = {
  title: string
  description: string
  image?: string
  datePublished?: string
  creator?: string
  genre?: string[]
  seasons?: number
  rating?: number
  url: string
}

type PersonStructuredData = {
  name: string
  description?: string
  image?: string
  birthDate?: string
  deathDate?: string
  url: string
}

export function generateMovieStructuredData(data: MovieStructuredData): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: data.title,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    director: data.director
      ? {
          "@type": "Person",
          name: data.director,
        }
      : undefined,
    genre: data.genre,
    duration: data.duration,
    aggregateRating: data.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: data.rating,
          bestRating: "10",
          worstRating: "0",
          ratingCount: "1000+",
        }
      : undefined,
    url: data.url,
  }

  return JSON.stringify(structuredData)
}

export function generateTVShowStructuredData(data: TVShowStructuredData): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: data.title,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    creator: data.creator
      ? {
          "@type": "Person",
          name: data.creator,
        }
      : undefined,
    genre: data.genre,
    numberOfSeasons: data.seasons,
    aggregateRating: data.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: data.rating,
          bestRating: "10",
          worstRating: "0",
          ratingCount: "1000+",
        }
      : undefined,
    url: data.url,
  }

  return JSON.stringify(structuredData)
}

export function generatePersonStructuredData(data: PersonStructuredData): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    description: data.description,
    image: data.image,
    birthDate: data.birthDate,
    deathDate: data.deathDate,
    url: data.url,
  }

  return JSON.stringify(structuredData)
}

export function generateWebsiteStructuredData(name: string, url: string): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: name,
    url: url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return JSON.stringify(structuredData)
}

