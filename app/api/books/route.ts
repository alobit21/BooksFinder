import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// Mock database for books
const books = new Map()

export async function POST(request: Request) {
  try {
    const session = await auth()
    console.log("POST - Session:", session)
    
    if (!session?.user?.id) {
      console.log("POST - No session found")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, author, description, fileUrl, coverUrl, fileType, fileSize, isPublic } = await request.json()

    if (!title || !fileUrl || !fileType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const book = {
      id: Date.now().toString(),
      title,
      author,
      description,
      fileUrl,
      coverUrl,
      fileType,
      fileSize,
      isPublic: isPublic || false,
      userId: session.user.id,
      createdAt: new Date().toISOString(),
    }

    books.set(book.id, book)
    console.log("Book created:", book)
    console.log("Total books in database:", books.size)

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    console.error("Book creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    console.log("GET - Session:", session)
    
    if (!session?.user?.id) {
      console.log("GET - No session found")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userBooks = Array.from(books.values()).filter(book => book.userId === session.user.id)
    console.log("Fetching books for user:", session.user.id)
    console.log("All books in database:", Array.from(books.values()))
    console.log("User books found:", userBooks)

    return NextResponse.json(userBooks)
  } catch (error) {
    console.error("Books fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
