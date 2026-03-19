"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Image } from "lucide-react"

interface SimpleUploadProps {
  onUpload: (url: string, type: string, size: number) => void
  accept: string
  label: string
  maxSize: string
  icon: React.ReactNode
}

export function SimpleUpload({ onUpload, accept, label, maxSize, icon }: SimpleUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file) return

    // Check file size
    const maxSizeBytes = parseInt(maxSize.replace('MB', '')) * 1024 * 1024
    if (file.size > maxSizeBytes) {
      alert(`File size must be less than ${maxSize}`)
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', accept.includes('image') ? 'cover' : 'book')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      onUpload(result.url, accept.includes('image') ? 'cover' : 'book', result.size)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }, [onUpload, accept, maxSize])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleClick = useCallback(() => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [isUploading])

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center space-y-2">
          {icon}
          {isUploading ? (
            <div className="text-sm text-blue-600">Uploading...</div>
          ) : (
            <div className="text-sm text-gray-600">
              <div>Click to upload or drag and drop</div>
              <div className="text-xs">Max size: {maxSize}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
