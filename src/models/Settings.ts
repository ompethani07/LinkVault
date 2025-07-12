import mongoose from 'mongoose'

export interface ISettings extends mongoose.Document {
  userId: string
  theme: 'dark' | 'light'
  notifications: boolean
  publicProfile: boolean
  defaultCategory: string
  autoDelete: boolean
  autoDeleteDays: number
  linkExpiration: boolean
  linkExpirationDays: number
  createdAt: Date
  updatedAt: Date
}

const SettingsSchema = new mongoose.Schema<ISettings>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark'
  },
  notifications: {
    type: Boolean,
    default: true
  },
  publicProfile: {
    type: Boolean,
    default: false
  },
  defaultCategory: {
    type: String,
    enum: ['work', 'personal', 'resources', 'projects'],
    default: 'work'
  },
  autoDelete: {
    type: Boolean,
    default: false
  },
  autoDeleteDays: {
    type: Number,
    default: 30,
    min: 1,
    max: 365
  },
  linkExpiration: {
    type: Boolean,
    default: false
  },
  linkExpirationDays: {
    type: Number,
    default: 7,
    min: 1,
    max: 365
  }
}, {
  timestamps: true
})

// Create indexes for better performance
SettingsSchema.index({ userId: 1 }, { unique: true })

// Clear any existing model and connections to force schema refresh
if (mongoose.models.Settings) {
  delete mongoose.models.Settings
}

// Force clean state
if (mongoose.connection.models?.Settings) {
  delete mongoose.connection.models.Settings
}

export default mongoose.model<ISettings>('Settings', SettingsSchema)
