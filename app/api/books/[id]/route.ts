import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      )
    }

    const book = await prisma.book.findFirst({
      where: {
        id,
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
  } catch (error: any) {
    console.error("Book fetch error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      )
    }

    const { title, author, description, coverUrl, isPublic } = await request.json()

    const book = await prisma.book.findFirst({
      where: {
        id,
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
      where: { id },
      data: {
        title,
        author,
        description,
        coverUrl,
        isPublic,
      },
    })

    return NextResponse.json(updatedBook)
  } catch (error: any) {
    console.error("Book update error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      )
    }

    const book = await prisma.book.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      )
    }

    // Delete associated Cloudinary assets
    if (book.coverUrl) {
      try {
        const publicId = book.coverUrl.split('/').pop()?.split('.')[0]
        if (publicId) {
          await cloudinary.uploader.destroy(`covers/${publicId}`)
        }
      } catch (error) {
        console.log("Failed to delete cover image:", error)
      }
    }

    if (book.fileUrl) {
      try {
        const publicId = book.fileUrl.split('/').pop()?.split('.')[0]
        if (publicId) {
          await cloudinary.uploader.destroy(`books/${publicId}`)
        }
      } catch (error) {
        console.log("Failed to delete book file:", error)
      }
    }

    await prisma.book.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error: any) {
    console.error("Book deletion error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
