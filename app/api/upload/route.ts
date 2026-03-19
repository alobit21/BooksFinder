import { NextResponse } from "next/server"
import { uploadFile } from "@/lib/cloudinary"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'book' or 'cover'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedBookTypes = ['application/pdf', 'application/epub+zip']
    const allowedImageTypes = ['image/jpeg', 'image/png']
    
    if (type === 'book' && !allowedBookTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only PDF and EPUB files are allowed." }, { status: 400 })
    }
    
    if (type === 'cover' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG and PNG images are allowed." }, { status: 400 })
    }

    // Upload to Cloudinary
    const folder = type === 'book' ? 'books' : 'covers'
    const result = await uploadFile(file, folder)

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      size: result.bytes
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
