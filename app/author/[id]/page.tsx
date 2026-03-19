import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAuthorDetails, getAuthorWorks } from "@/lib/openlibrary"
import { AuthorDetailsClient } from "./client"

interface AuthorPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const author = await getAuthorDetails(id)
    
    return {
      title: author.name || "Author Details",
      description: author.bio?.value || author.bio || `Details about author ${author.name}`,
    }
  } catch {
    return {
      title: "Author Not Found",
      description: "The requested author could not be found.",
    }
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  try {
    const { id } = await params
    const [author, works] = await Promise.all([
      getAuthorDetails(id),
      getAuthorWorks(id, 20)
    ])
    
    return <AuthorDetailsClient author={author} works={works} />
  } catch (error) {
    notFound()
  }
}
