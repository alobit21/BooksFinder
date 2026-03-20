import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/lib/auth"

const f = createUploadthing()

const handleAuth = async () => {
  const session = await auth()
  if (!session || !session.user) throw new Error("Unauthorized")
  return { userId: session.user.id }
}

export const ourFileRouter = {
  bookUploader: f({
    pdf: { maxFileSize: "32MB", maxFileCount: 1 },
    "application/epub+zip": { maxFileSize: "32MB", maxFileCount: 1 },
  })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      return { uploadedBy: metadata.userId }
    }),
  coverUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Cover upload complete for userId:", metadata.userId)
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
