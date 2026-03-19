import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { UserBookCard } from "@/components/user-book-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, User } from "lucide-react"

async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
  return user
}

async function getPublicBooks(userId: string) {
  const books = await prisma.book.findMany({
    where: {
      userId,
      isPublic: true,
    },
    orderBy: { createdAt: "desc" },
  })
  return books
}

export default async function PublicLibrary({ params }: { params: { userId: string } }) {
  const user = await getUser(params.userId)
  
  if (!user) {
    notFound()
  }

  const books = await getPublicBooks(params.userId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {user.name || user.email}'s Public Library
              </CardTitle>
              <CardDescription>
                Browse the public book collection shared by this user
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No public books available
            </h3>
            <p className="text-gray-600">
              This user hasn't shared any books publicly yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book: any) => (
              <UserBookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
