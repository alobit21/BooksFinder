import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'demo'
const apiKey = process.env.CLOUDINARY_API_KEY || 'demo'
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'demo'

// Initialize Cloudinary
const cloudinaryInstance = cloudinary({
  cloud: {
    cloudName,
    apiKey,
    apiSecret,
  },
})

export async function uploadFile(file: File, folder: string = 'books') {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const result = await new Promise((resolve, reject) => {
      cloudinaryInstance.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder,
          public_id: `${Date.now()}-${file.name}`,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return result
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

export { cloudinaryInstance }
