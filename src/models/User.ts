import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
  },
  subscriptionId: {
    type: String,
    default: null,
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'inactive',
  },
  linksCreated: {
    type: Number,
    default: 0,
  },
  totalFileSize: {
    type: Number,
    default: 0, // Total bytes used across all files
  },
  adCredits: {
    type: Number,
    default: 0,
  },
  planLimits: {
    maxLinks: {
      type: Number,
      default: 5, // Free tier limit
    },
    maxFileSize: {
      type: Number,
      default: 10 * 1024 * 1024, // 10MB in bytes
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Set plan limits based on plan type
  if (this.plan === 'premium') {
    this.planLimits.maxLinks = -1; // -1 means unlimited
    this.planLimits.maxFileSize = -1; // -1 means unlimited
  } else {
    this.planLimits.maxLinks = 5;
    this.planLimits.maxFileSize = 10 * 1024 * 1024; // 10MB
  }
  
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
