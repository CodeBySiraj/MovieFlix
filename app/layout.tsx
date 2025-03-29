import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { generateWebsiteStructuredData } from "@/lib/seo"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "MovieFlix - Discover Movies and TV Shows",
    template: "%s | MovieFlix",
  },
  description:
    "Browse and discover movies and TV shows from TMDB. Find information about the latest releases, popular titles, and more.",
  keywords: ["movies", "tv shows", "films", "cinema", "actors", "directors", "TMDB", "entertainment", "streaming"],
  authors: [{ name: "MovieFlix Team" }],
  creator: "MovieFlix",
  publisher: "MovieFlix",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://movieflix.example.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MovieFlix - Discover Movies and TV Shows",
    description:
      "Browse and discover movies and TV shows from TMDB. Find information about the latest releases, popular titles, and more.",
    url: "https://movieflix.example.com",
    siteName: "MovieFlix",
    images: [
      {
        url: "https://movieflix.example.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MovieFlix - Discover Movies and TV Shows",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieFlix - Discover Movies and TV Shows",
    description:
      "Browse and discover movies and TV shows from TMDB. Find information about the latest releases, popular titles, and more.",
    images: ["https://movieflix.example.com/twitter-image.jpg"],
    creator: "@movieflix",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const websiteStructuredData = generateWebsiteStructuredData(
    "MovieFlix - Discover Movies and TV Shows",
    "https://movieflix.example.com",
  )

  return (
    <html lang="en" className="dark">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteStructuredData }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'