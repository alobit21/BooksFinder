import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSubjectBooks } from "@/lib/openlibrary"
import { SubjectClient } from "./client"

interface SubjectPageProps {
  params: {
    name: string
  }
}

export async function generateMetadata({ params }: SubjectPageProps): Promise<Metadata> {
  const { name } = await params
  const subjectName = decodeURIComponent(name).replace(/-/g, ' ')
  
  return {
    title: `${subjectName} - Books`,
    description: `Explore books in the ${subjectName} subject category`,
  }
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  try {
    const { name } = await params
    const subjectName = decodeURIComponent(name).replace(/-/g, ' ')
    const data = await getSubjectBooks(name, 50)
    
    return <SubjectClient subjectName={subjectName} data={data} />
  } catch (error) {
    notFound()
  }
}
