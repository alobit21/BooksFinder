"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Image, CheckCircle } from "lucide-react"

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadComplete, setUploadComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file) return

    // Check file size
    const maxSizeBytes = parseInt(maxSize.replace('MB', '')) * 1024 * 1024
    if (file.size > maxSizeBytes) {
      alert(`File size must be less than ${maxSize}`)
      return
    }

    setSelectedFile(file)
    setUploadComplete(false)
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
      setUploadComplete(true)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
      setSelectedFile(null)
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
          ${uploadComplete ? 'border-green-500 bg-green-50' : ''}
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
          {uploadComplete ? (
            <>
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="text-sm text-green-600">
                <div>Upload successful!</div>
                <div className="text-xs">{selectedFile?.name}</div>
              </div>
            </>
          ) : isUploading ? (
            <>
              <div className="h-8 w-8 text-blue-500 animate-pulse">⏳</div>
              <div className="text-sm text-blue-600">
                <div>Uploading...</div>
                <div className="text-xs">{selectedFile?.name}</div>
              </div>
            </>
          ) : selectedFile ? (
            <>
              {icon}
              <div className="text-sm text-gray-600">
                <div>Selected: {selectedFile.name}</div>
                <div className="text-xs">Click to change file</div>
              </div>
            </>
          ) : (
            <>
              {icon}
              <div className="text-sm text-gray-600">
                <div>Click to upload or drag and drop</div>
                <div className="text-xs">Max size: {maxSize}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
