import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    let allBooks
    
    if (userId) {
      // Return specific user's books
      allBooks = await prisma.book.findMany({
        where: { userId: userId },
        orderBy: { createdAt: "desc" },
      })
      console.log("Search API - User books:", userId, allBooks.length)
    } else {
      // Return all books for main page search
      allBooks = await prisma.book.findMany({
        orderBy: { createdAt: "desc" },
      })
      console.log("Search API - All books:", allBooks.length)
    }

    return NextResponse.json(allBooks)
  } catch (error) {
    console.error("Search books error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
