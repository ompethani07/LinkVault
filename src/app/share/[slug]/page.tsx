'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import StaticLogo from '@/components/StaticLogo'

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  preview: string
  file?: File
  data?: string // Base64 data for localStorage storage
}

interface Link {
  id: string
  title: string
  url: string
  description: string
  category: string
  image?: string
  isFile?: boolean
  files?: UploadedFile[]
  customSlug?: string
  shareUrl?: string
  createdAt: Date
}

export default function SharePage() {
  const params = useParams()
  const slug = params.slug as string
  const [link, setLink] = useState<Link | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewingFile, setViewingFile] = useState<UploadedFile | null>(null)
  const [showViewer, setShowViewer] = useState(false)

  useEffect(() => {
    fetchLink()
  }, [slug])

  const fetchLink = async () => {
    try {
      const response = await fetch(`/api/share/${slug}`)
      
      if (response.ok) {
        const data = await response.json()
        setLink(data.link)
      } else {
        setError('Link not found')
      }
    } catch (error) {
      console.error('Error fetching link:', error)
      setError('Failed to load link')
    }
    
    setLoading(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }



  const viewFile = (file: UploadedFile) => {
    setViewingFile(file)
    setShowViewer(true)
  }

  const closeViewer = () => {
    setViewingFile(null)
    setShowViewer(false)
  }

  const downloadFile = (file: UploadedFile) => {
    try {
      let downloadUrl: string
      let shouldRevoke = false
      
      // Check if file.file is a valid File object
      if (file.file && file.file instanceof File) {
        downloadUrl = URL.createObjectURL(file.file)
        shouldRevoke = true
      } else if (file.data) {
        downloadUrl = file.data
      } else {
        downloadUrl = file.preview
      }
      
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = file.name
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      if (shouldRevoke) {
        URL.revokeObjectURL(downloadUrl)
      }
    } catch (error) {
      console.error('Download failed:', error)
      if (file.data) {
        const link = document.createElement('a')
        link.href = file.data
        link.download = file.name
        link.target = '_blank'
        link.click()
      } else {
        window.open(file.preview, '_blank')
      }
    }
  }

  const downloadAll = () => {
    if (!link?.files) return
    link.files.forEach(file => downloadFile(file))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Link Not Found</h1>
          <p className="text-gray-400">The shared link you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
              linear-gradient(45deg, transparent 40%, rgba(220, 38, 38, 0.03) 50%, transparent 60%)
            `
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/80 backdrop-blur-md border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <div className="flex items-center space-x-4">
              <StaticLogo size={52} />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  LinkVault
                </h1>
                <p className="text-xs text-gray-500 tracking-wide">SHARED CONTENT</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Share Info */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">{link.title}</h1>
          {link.description && (
            <p className="text-xl text-gray-300 mb-6">{link.description}</p>
          )}
          <div className="inline-flex items-center px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-full">
            <span className="text-red-400 font-semibold text-sm">{link.category}</span>
          </div>
        </div>

        {/* Files Grid */}
        {link.files && link.files.length > 0 && (
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                Shared Files ({link.files.length})
              </h2>
              <button
                onClick={downloadAll}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-4 4V4" />
                </svg>
                Download All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {link.files.map((file) => (
                <div key={file.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={file.data || file.preview} 
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-red-600/20 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="w-full">
                      <h3 className="font-semibold text-white mb-1 truncate" title={file.name}>
                        {file.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                    </div>

                    <div className="w-full flex space-x-2">
                      <button
                        onClick={() => viewFile(file)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-300"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      <button
                        onClick={() => downloadFile(file)}
                        className="px-3 py-2 bg-gray-700/60 hover:bg-gray-600/60 text-white font-medium rounded-lg transition-colors duration-300"
                        title="Download"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            🔒 Secured by LinkVault • Professional File Sharing Platform
          </p>
        </div>
      </div>

      {/* File Viewer Modal */}
      {showViewer && viewingFile && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h3 className="text-xl font-bold text-white">{viewingFile.name}</h3>
                <p className="text-gray-400 text-sm">{formatFileSize(viewingFile.size)} • {viewingFile.type}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => downloadFile(viewingFile)}
                  className="inline-flex items-center px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={closeViewer}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-auto">
              {viewingFile.type.startsWith('image/') && (
                <div className="flex justify-center">
                  <img 
                    src={viewingFile.data || viewingFile.preview} 
                    alt={viewingFile.name}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              )}

              {viewingFile.type === 'application/pdf' && viewingFile.data && (
                <div className="w-full h-96">
                  <iframe 
                    src={viewingFile.data} 
                    className="w-full h-full rounded-lg border border-gray-700"
                    title={viewingFile.name}
                  />
                </div>
              )}

              {viewingFile.type.startsWith('text/') && viewingFile.data && (
                <div className="bg-gray-800 rounded-lg p-6 font-mono text-sm text-gray-300">
                  <pre className="whitespace-pre-wrap">
                    {atob(viewingFile.data.split(',')[1])}
                  </pre>
                </div>
              )}

              {viewingFile.type.startsWith('video/') && (
                <div className="flex justify-center">
                  <video 
                    src={viewingFile.data || viewingFile.preview} 
                    controls
                    className="max-w-full max-h-96 rounded-lg"
                  />
                </div>
              )}

              {!viewingFile.type.startsWith('image/') && 
               !viewingFile.type.startsWith('text/') && 
               !viewingFile.type.startsWith('video/') && 
               viewingFile.type !== 'application/pdf' && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Preview Not Available</h3>
                  <p className="text-gray-400 mb-6">This file type cannot be previewed in the browser.</p>
                  <button
                    onClick={() => downloadFile(viewingFile)}
                    className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Download to View
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
