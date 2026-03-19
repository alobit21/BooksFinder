import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { BookReader } from "@/components/book-reader"

async function getBook(bookId: string, userId: string) {
  const book = await prisma.book.findFirst({
    where: {
      id: bookId,
      userId,
    },
  })

  if (!book) {
    return null
  }

  return book
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const { id } = await params
  const book = await getBook(id, session.user.id)

  if (!book) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">{book.title}</h1>
          {book.author && (
            <p className="text-muted-foreground mt-2">by {book.author}</p>
          )}
        </div>
        
        <BookReader book={book} />
      </div>
    </div>
  )
}
