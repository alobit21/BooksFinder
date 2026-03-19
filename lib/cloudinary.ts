// Mock Cloudinary upload for demo purposes
// In production, this would upload to Cloudinary

export async function uploadFile(file: File, folder: string = 'books') {
  try {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create a mock URL for demo
    const mockUrl = `https://picsum.photos/seed/${file.name}-${Date.now()}/400/600.jpg`
    
    const result = {
      secure_url: mockUrl,
      public_id: `${folder}/${Date.now()}-${file.name}`,
      resource_type: folder === 'covers' ? 'image' : 'raw',
      format: file.name.split('.').pop() || 'pdf',
      bytes: file.size
    }
    
    console.log('Mock upload successful:', result)
    return result
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

export const cloudinary = {
  v2: {
    config: () => {
      console.log('Mock Cloudinary configured')
    }
  }
}
