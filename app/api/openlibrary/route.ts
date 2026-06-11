import { NextResponse } from "next/server"

const BASE_URL = "https://openlibrary.org"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const action = url.searchParams.get("action")

    let targetUrl = ""

    switch (action) {
      case "search": {
        const query = url.searchParams.get("query")
        const page = url.searchParams.get("page") || "1"
        const limit = url.searchParams.get("limit") || "20"
        if (!query) {
          return NextResponse.json({ error: "query is required" }, { status: 400 })
        }
        targetUrl = `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&fields=title,author_name,cover_i,first_publish_year,ia,public_scan_b,key,isbn`
        break
      }
      case "work": {
        const workId = url.searchParams.get("workId")
        if (!workId) {
          return NextResponse.json({ error: "workId is required" }, { status: 400 })
        }
        targetUrl = `${BASE_URL}/works/${workId}.json`
        break
      }
      case "author": {
        const authorId = url.searchParams.get("authorId")
        if (!authorId) {
          return NextResponse.json({ error: "authorId is required" }, { status: 400 })
        }
        targetUrl = `${BASE_URL}/authors/${authorId}.json`
        break
      }
      case "author-works": {
        const authorId = url.searchParams.get("authorId")
        const limit = url.searchParams.get("limit") || "20"
        if (!authorId) {
          return NextResponse.json({ error: "authorId is required" }, { status: 400 })
        }
        targetUrl = `${BASE_URL}/authors/${authorId}/works.json?limit=${limit}`
        break
      }
      case "subject": {
        const subject = url.searchParams.get("subject")
        const limit = url.searchParams.get("limit") || "20"
        if (!subject) {
          return NextResponse.json({ error: "subject is required" }, { status: 400 })
        }
        targetUrl = `${BASE_URL}/subjects/${encodeURIComponent(subject)}.json?limit=${limit}`
        break
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const upstream = await fetch(targetUrl, {
      headers: {
        "User-Agent": "BooksFinder/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    })

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream responded with ${upstream.status}` },
        { status: upstream.status }
      )
    }

    const data = await upstream.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Open Library proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch from Open Library" }, { status: 500 })
  }
}
