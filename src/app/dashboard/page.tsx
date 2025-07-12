'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import StaticLogo from '@/components/StaticLogo'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import LoadingLink from '@/components/LoadingLink'
import { useSearchParams } from 'next/navigation'
import AdRewardModal from '@/components/AdRewardModal'

// Extend window type for global delete handler
declare global {
  interface Window {
    showDeleteModal?: (linkId: string, linkTitle: string, onDelete: (id: string) => void) => void
  }
}

// Copy button component with local state
function CopyButton({ text, className }: { text: string, className: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for browsers without clipboard API or non-HTTPS
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'absolute'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      prompt('Copy this link manually:', text)
    }
  }

  return (
    <button 
      onClick={handleCopy} 
      className={`text-xs font-semibold px-3 py-1 rounded-md transition-all duration-300 ${
        copied
          ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
          : 'text-red-400 hover:text-red-300 hover:bg-red-600/10 border border-transparent'
      }`}
    >
      {copied ? (
        <span className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </span>
      ) : (
        <span className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </span>
      )}
    </button>
  )
}

// Simple confirmation modal
function ConfirmDeleteModal({ 
  isOpen, 
  linkTitle, 
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean, 
  linkTitle: string, 
  onConfirm: () => void, 
  onCancel: () => void 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      
      <div className="relative bg-gray-900 border border-red-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Delete Link</h3>
          <p className="text-gray-400 mb-2">Are you sure you want to delete</p>
          <p className="text-red-400 font-semibold text-lg">"{linkTitle}"?</p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// Countdown deletion modal
function CountdownDeleteModal({ 
  isOpen, 
  linkTitle, 
  onComplete, 
  onCancel 
}: { 
  isOpen: boolean, 
  linkTitle: string, 
  onComplete: () => void, 
  onCancel: () => void 
}) {
  const [countdown, setCountdown] = useState(10)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setCountdown(10)
      setIsDeleting(false)
      return
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsDeleting(true)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, onComplete])

  if (!isOpen) return null

  const canCancel = countdown > 6
  const progressPercentage = ((10 - countdown) / 10) * 100

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div className="relative bg-gray-900 border border-red-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Deleting Link</h3>
          <p className="text-red-400 font-semibold">"{linkTitle}"</p>
        </div>

        <div className="space-y-3 mb-6 text-sm">
          <div className="flex items-center space-x-3 text-red-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>This action cannot be undone</span>
          </div>
          <div className="flex items-center space-x-3 text-yellow-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 00-2 2z" />
            </svg>
            <span>Will NOT decrease your link limit count</span>
          </div>
          <div className="flex items-center space-x-3 text-blue-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>You will still have the same used slots</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">Auto-delete in:</span>
            <span className={`text-3xl font-bold ${countdown <= 6 ? 'text-red-400' : 'text-white'}`}>
              {countdown}s
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                countdown <= 6 ? 'bg-red-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {countdown <= 6 && (
            <p className="text-xs text-red-400 mt-2 text-center font-semibold">
              🔒 Cannot cancel after 6 seconds
            </p>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            disabled={!canCancel || isDeleting}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              canCancel && !isDeleting
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
            }`}
          >
            {canCancel ? 'Cancel' : 'Too Late'}
          </button>
          <button
            onClick={() => {
              setIsDeleting(true)
              onComplete()
            }}
            disabled={isDeleting}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              isDeleting
                ? 'bg-red-800 text-red-300 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isDeleting ? 'Deleting...' : 'Delete Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Delete button component with two-step process
function DeleteButton({ linkId, linkTitle, onDelete }: { linkId: string, linkTitle: string, onDelete: (id: string) => void }) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Call global delete handler
    window.showDeleteModal?.(linkId, linkTitle, onDelete)
  }

  return (
    <button 
      onClick={handleDelete}
      className="text-gray-500 hover:text-red-400 ml-4 transition-colors p-1 rounded-lg hover:bg-red-950/20"
      title="Delete link"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}

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

export default function Dashboard() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const [links, setLinks] = useState<Link[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAdRewardModal, setShowAdRewardModal] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: '',
    category: 'work',
    image: '',
    isFile: false,
    customSlug: ''
  })
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([])
  const [previewUrl, setPreviewUrl] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [userSettings, setUserSettings] = useState<any>(null)
  // Remove global states - we'll use local state in each component
  const [userLimits, setUserLimits] = useState<{
    canCreateLink: boolean
    canUploadFile: boolean
    maxFileSize: number
    totalFileSizeUsed: number
    linksUsed: number
    linksLimit: number
    plan: string
    adCredits: number
  } | null>(null)

  // Global delete modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDeleteCountdown, setShowDeleteCountdown] = useState(false)
  const [deleteLinkId, setDeleteLinkId] = useState('')
  const [deleteLinkTitle, setDeleteLinkTitle] = useState('')
  const [deleteCallback, setDeleteCallback] = useState<((id: string) => void) | null>(null)

  // Load existing links and settings from MongoDB on mount
  useEffect(() => {
    fetchLinks()
    loadUserSettings()
    
    // Check for payment success
    if (searchParams.get('success') === 'true') {
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 5000)
    }
  }, [])

  // Global delete handler
  const showDeleteModal = (linkId: string, linkTitle: string, onDelete: (id: string) => void) => {
    setDeleteLinkId(linkId)
    setDeleteLinkTitle(linkTitle)
    setDeleteCallback(() => onDelete)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false)
    setShowDeleteCountdown(true)
  }

  const handleDeleteComplete = async () => {
    if (deleteCallback) {
      try {
        await deleteCallback(deleteLinkId)
        setShowDeleteCountdown(false)
      } catch (error) {
        console.error('Delete failed:', error)
        setShowDeleteCountdown(false)
      }
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
    setShowDeleteCountdown(false)
    setDeleteLinkId('')
    setDeleteLinkTitle('')
    setDeleteCallback(null)
  }

  // Expose global delete handler to window
  useEffect(() => {
    window.showDeleteModal = showDeleteModal
    return () => {
      delete window.showDeleteModal
    }
  }, [])

  const loadUserSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setUserSettings(data.settings)
        // Update default category for new links
        setNewLink(prev => ({ ...prev, category: data.settings.defaultCategory || 'work' }))
      }
    } catch (error) {
      console.error('Error loading user settings:', error)
    }
  }

  const resetForm = () => {
    setNewLink({
      title: '',
      url: '',
      description: '',
      category: userSettings?.defaultCategory || 'work',
      image: '',
      isFile: false,
      customSlug: ''
    })
    setSelectedFiles([])
    setPreviewUrl('')
  }

  const openCreateModal = () => {
    // Check if user can create more links
    if (userLimits && !userLimits.canCreateLink) {
      setShowAdRewardModal(true)
      return
    }
    
    resetForm()
    setShowCreateModal(true)
  }

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links')
      if (response.ok) {
        const data = await response.json()
        setLinks(data.links)
        setUserLimits(data.userLimits)
      }
    } catch (error) {
      console.error('Error fetching links:', error)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = []
    
    for (const file of acceptedFiles) {
      try {
        const data = await fileToBase64(file)
        newFiles.push({
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          name: file.name,
          type: file.type,
          size: file.size,
          preview: URL.createObjectURL(file),
          file: file,
          data: data
        })
      } catch (error) {
        console.error('Error converting file to base64:', error)
      }
    }
    
    setSelectedFiles(prev => [...prev, ...newFiles])
    setNewLink(prev => ({
      ...prev,
      isFile: true
    }))
    setShowCreateModal(true)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md'],
      'application/*': ['.zip', '.doc', '.docx', '.xls', '.xlsx']
    },
    multiple: true
  })

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const slug = newLink.customSlug || generateSlug(newLink.title)
    
    // Prepare files for storage (remove File objects, keep only serializable data)
    const storableFiles = selectedFiles.map(file => ({
      id: file.id,
      name: file.name,
      type: file.type,
      size: file.size,
      preview: file.preview,
      data: file.data // Only store base64 data
      // Remove file object as it's not serializable
    }))
    
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newLink,
          files: storableFiles,
          customSlug: slug
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Refresh links from server
        await fetchLinks()
        
        resetForm()
        setShowCreateModal(false)
      } else {
        const error = await response.json()
        if (error.showAdOption) {
          setShowCreateModal(false)
          setShowAdRewardModal(true)
        } else {
          alert(error.error || 'Failed to create link')
        }
      }
    } catch (error) {
      console.error('Error creating link:', error)
      alert('Failed to create link')
    }
  }

  const deleteLink = async (id: string) => {
    try {
      console.log('Deleting link with ID:', id)
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        console.log('Link deleted successfully')
        // Refresh links from server
        await fetchLinks()
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Failed to delete link:', response.status, errorData)
        throw new Error(`Failed to delete link: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting link:', error)
      throw error // Re-throw so DeleteButton can handle it
    }
  }

  const removeFile = (fileId: string) => {
    setSelectedFiles(files => files.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Simple copy function without state management
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for browsers without clipboard API or non-HTTPS
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'absolute'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Show the text for manual copying
      prompt('Copy this link manually:', text)
    }
  }

  // Filter links based on search query and category
  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (link.customSlug && link.customSlug.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || link.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const categories = ['work', 'personal', 'resources', 'projects']

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 90% 10%, rgba(220, 38, 38, 0.03) 0%, transparent 80%)
            `
          }}
        />
      </div>
      
      {/* Header */}
      <header className="relative z-10 bg-black/80 backdrop-blur-md border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <StaticLogo size={52} />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                    LinkVault
                  </h1>
                  <p className="text-xs text-gray-500 tracking-wide">DASHBOARD</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <div className="h-6 w-px bg-gray-700"></div>
                <nav className="flex space-x-6">
                  <LoadingLink href="/dashboard" className="text-red-400 font-medium">Dashboard</LoadingLink>
                  <LoadingLink href="/analytics" className="text-gray-400 hover:text-red-400 transition-colors">Analytics</LoadingLink>
                  <LoadingLink href="/settings" className="text-gray-400 hover:text-red-400 transition-colors">Settings</LoadingLink>
                  <LoadingLink href="/pricing" className="text-gray-400 hover:text-red-400 transition-colors">Pricing</LoadingLink>
                </nav>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-300 font-medium">Welcome back,</p>
                <p className="text-lg font-bold text-white">{user?.firstName}</p>
              </div>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-8 bg-green-950/20 border border-green-500/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-green-400 font-medium">Payment Successful!</h3>
                <p className="text-green-300 text-sm">Welcome to LinkVault Premium! You now have access to all premium features.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Links</p>
                <p className="text-3xl font-bold text-white mt-1">{links.length}</p>
                {userLimits && (
                  <p className="text-xs text-gray-500 mt-1">
                    {userLimits.linksLimit === -1 ? 'Unlimited' : `${userLimits.linksUsed}/${userLimits.linksLimit}`}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Categories</p>
                <p className="text-3xl font-bold text-white mt-1">{new Set(links.map(l => l.category)).size}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700/40 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">File Storage</p>
                <p className="text-3xl font-bold text-white mt-1">{links.filter(l => l.isFile).length}</p>
                {userLimits && (
                  <p className="text-xs text-gray-500 mt-1">
                    {userLimits.maxFileSize === -1 
                      ? `${Math.round(userLimits.totalFileSizeUsed / 1024 / 1024)}MB used` 
                      : `${Math.round(userLimits.totalFileSizeUsed / 1024 / 1024)}MB / ${Math.round(userLimits.maxFileSize / 1024 / 1024)}MB`
                    }
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className={`bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border ${userLimits?.plan === 'premium' ? 'border-yellow-500/50 bg-yellow-900/10' : 'border-gray-800/50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Plan Status</p>
                <p className={`text-3xl font-bold mt-1 ${userLimits?.plan === 'premium' ? 'text-yellow-400' : 'text-white'}`}>
                  {userLimits?.plan === 'premium' ? 'Premium' : 'Free'}
                </p>
                {userLimits?.plan === 'free' && (
                  <Link href="/pricing" className="text-xs text-red-400 hover:text-red-300 underline">
                    Upgrade to Premium
                  </Link>
                )}
              </div>
              <div className={`w-12 h-12 ${userLimits?.plan === 'premium' ? 'bg-yellow-600/20' : 'bg-gray-600/20'} rounded-lg flex items-center justify-center`}>
                {userLimits?.plan === 'premium' ? (
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ad Credits Card */}
        {userLimits && userLimits.plan === 'free' && (
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/50 bg-yellow-900/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Ad Credits</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">{userLimits.adCredits}</p>
                <p className="text-xs text-yellow-300 mt-1">
                  Watch ads to earn more credits
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-3">
            <button
              onClick={() => setShowAdRewardModal(true)}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a2.5 2.5 0 010 4.998L15 15M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
              </svg>
              <span>Watch Ad to Earn 2 Link Credits</span>
            </button>
          </div>
          {/* Left Column - Create Link */}
          <div className="lg:col-span-2">
            {/* Drag and Drop Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer mb-8 ${
                isDragActive 
                  ? 'border-red-500 bg-red-950/20 backdrop-blur-sm' 
                  : 'border-gray-700 hover:border-gray-600 bg-gray-900/40 backdrop-blur-sm'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-6">
                <div className="mx-auto w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
                  </h3>
                  <p className="text-gray-400">
                    or click to select files • Images, PDFs, documents supported
                  </p>
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={openCreateModal}
                    disabled={userLimits && !userLimits.canCreateLink}
                    className={`inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-all duration-300 shadow-lg ${
                      userLimits && !userLimits.canCreateLink
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:shadow-red-900/50'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {userLimits && !userLimits.canCreateLink ? 'Limit Reached' : 'Create New Link'}
                  </button>
                </div>
              </div>
            </div>

            {/* Links Grid */}
            <div>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">Your Links</h2>
                
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search links..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900/60 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    />
                  </div>
                  
                  {/* Category Filter */}
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:border-red-500 focus:outline-none transition-colors"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {filteredLinks.length === 0 ? (
                <div className="text-center py-16 bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-800/50">
                  <div className="mx-auto w-16 h-16 bg-gray-700/40 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {searchQuery || selectedCategory !== 'all' ? 'No matching links' : 'No links yet'}
                  </h3>
                  <p className="text-gray-400">
                    {searchQuery || selectedCategory !== 'all' 
                      ? 'Try adjusting your search or filter' 
                      : 'Start by creating your first link or uploading a file'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredLinks.map((link) => (
                    <div 
                      key={link._id} 
                      className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-white truncate text-lg group-hover:text-red-400 transition-colors">{link.title}</h3>
                          <p className="text-gray-400 mt-1 text-sm">{link.description}</p>
                        </div>
                        <DeleteButton 
                          linkId={link._id} 
                          linkTitle={link.title} 
                          onDelete={deleteLink} 
                        />
                      </div>
                      
                      {link.image && (
                        <div className="mb-4">
                          <img 
                            src={link.image} 
                            alt={link.title}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        {link.files && link.files.length > 0 && (
                          <div className="text-sm text-gray-400">
                            📁 {link.files.length} file{link.files.length > 1 ? 's' : ''} shared
                          </div>
                        )}
                        
                        {link.shareUrl && (
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-400 font-medium">Share URL:</span>
                              <CopyButton text={link.shareUrl!} className="" />
                            </div>
                            <div className="bg-gray-900/50 rounded-md p-2 border border-gray-700/30">
                              <p className="text-sm text-gray-300 font-mono truncate">{link.shareUrl}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-600/20 text-red-400 border border-red-600/30">
                            {link.category}
                          </span>
                          <div className="flex items-center space-x-2">
                            {link.shareUrl && (
                              <a
                                href={link.shareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
                              >
                                View →
                              </a>
                            )}
                            {!link.isFile && (
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
                              >
                                Visit →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
              <h3 className="text-xl font-bold text-white mb-6">Quick Stats</h3>
              <div className="space-y-4">
                {categories.map(category => {
                  const count = links.filter(l => l.category === category).length
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize font-medium">{category}</span>
                      <span className="text-red-400 font-bold">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-400">
                  No recent activity
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">
                {selectedFiles.length > 0 ? 'Create File Share Link' : 'Create New Link'}
              </h2>
            </div>
            
            <form onSubmit={handleCreateLink} className="p-6 space-y-6">
              {/* File Upload Area */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${
                  isDragActive 
                    ? 'border-red-500 bg-red-950/20' 
                    : 'border-gray-600 hover:border-gray-500 bg-gray-800/20'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-3">
                  <div className="mx-auto w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {selectedFiles.length > 0 ? 'Add more files' : 'Drop files here or click to select'}
                    </p>
                    <p className="text-gray-400 text-sm">Multiple files supported</p>
                  </div>
                </div>
              </div>

              {/* Selected Files Display */}
              {selectedFiles.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Selected Files ({selectedFiles.length})
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                        <div className="flex items-center space-x-3">
                          {file.type.startsWith('image/') ? (
                            <img src={file.preview} alt={file.name} className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <p className="text-white text-sm font-medium truncate max-w-48">{file.name}</p>
                            <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Link Title
                </label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="Enter link title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Custom Link Name (Optional)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">{window.location.origin}/share/</span>
                  <input
                    type="text"
                    value={newLink.customSlug}
                    onChange={(e) => setNewLink({...newLink, customSlug: e.target.value})}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="chatgpt"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-1">Leave empty to auto-generate from title</p>
              </div>

              {!newLink.isFile && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="https://example.com"
                    required={!newLink.isFile}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newLink.description}
                  onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                  rows={3}
                  placeholder="Optional description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newLink.category}
                  onChange={(e) => setNewLink({...newLink, category: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-3 border border-gray-700 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
                >
                  Create Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Delete Modals */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        linkTitle={deleteLinkTitle}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <CountdownDeleteModal
        isOpen={showDeleteCountdown}
        linkTitle={deleteLinkTitle}
        onComplete={handleDeleteComplete}
        onCancel={handleDeleteCancel}
      />

      <AdRewardModal
        isOpen={showAdRewardModal}
        onClose={() => setShowAdRewardModal(false)}
        onSuccess={() => {
          fetchLinks()
          setShowAdRewardModal(false)
          setShowCreateModal(true)
        }}
      />

      {/* Professional Delete Animation */}
      <style jsx>{`
        @keyframes slideOut {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          
          100% {
            transform: translateX(30px) scale(0.95);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
