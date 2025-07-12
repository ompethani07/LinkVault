import mongoose from 'mongoose'

// Define file subdocument schema
const FileSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  preview: {
    type: String
  },
  data: {
    type: String,
    required: true
  }
}, { _id: false })

export interface ILink extends mongoose.Document {
  title: string
  url?: string
  description: string
  category: string
  image?: string
  isFile: boolean
  files: {
    id: string
    name: string
    type: string
    size: number
    preview?: string
    data: string
  }[]
  customSlug: string
  shareUrl: string
  userId: string
  views: number
  clicks: number
  createdAt: Date
  updatedAt: Date
}

const LinkSchema = new mongoose.Schema<ILink>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['work', 'personal', 'resources', 'projects'],
    default: 'work'
  },
  image: {
    type: String
  },
  isFile: {
    type: Boolean,
    default: false
  },
  files: [FileSchema],
  customSlug: {
    type: String,
    required: true,
    trim: true
  },
  shareUrl: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Create indexes for better performance
LinkSchema.index({ userId: 1, createdAt: -1 })
LinkSchema.index({ customSlug: 1 }, { unique: true })
LinkSchema.index({ userId: 1, category: 1 })

// Clear any existing model and connections to force schema refresh
if (mongoose.models.Link) {
  delete mongoose.models.Link
}

// Force clean state
if (mongoose.connection.models?.Link) {
  delete mongoose.connection.models.Link
}

export default mongoose.model<ILink>('Link', LinkSchema)
