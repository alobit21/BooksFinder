import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const book = await prisma.book.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Book fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, author, description, coverUrl, isPublic } = await request.json()

    const book = await prisma.book.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      )
    }

    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: {
        title,
        author,
        description,
        coverUrl,
        isPublic,
      },
    })

    return NextResponse.json(updatedBook)
  } catch (error) {
    console.error("Book update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const book = await prisma.book.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      )
    }

    await prisma.book.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Book deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
