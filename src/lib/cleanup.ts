import dbConnect from './mongodb'
import Link from '@/models/Link'
import Settings from '@/models/Settings'

export async function cleanupExpiredLinks() {
  try {
    await dbConnect()
    
    // Get all users who have auto-delete enabled
    const usersWithAutoDelete = await Settings.find({ 
      autoDelete: true 
    }).lean()
    
    let totalDeleted = 0
    
    for (const userSettings of usersWithAutoDelete) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - userSettings.autoDeleteDays)
      
      // Delete old links for this user
      const result = await Link.deleteMany({
        userId: userSettings.userId,
        createdAt: { $lt: cutoffDate }
      })
      
      totalDeleted += result.deletedCount
      
      if (result.deletedCount > 0) {
        console.log(`Deleted ${result.deletedCount} old links for user ${userSettings.userId}`)
      }
    }
    
    return { success: true, totalDeleted }
  } catch (error) {
    console.error('Error cleaning up expired links:', error)
    return { success: false, error: error.message }
  }
}

export async function cleanupExpiredLinksForUser(userId: string) {
  try {
    await dbConnect()
    
    // Get user settings
    const userSettings = await Settings.findOne({ userId })
    
    if (!userSettings || !userSettings.autoDelete) {
      return { success: true, message: 'Auto-delete not enabled for user' }
    }
    
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - userSettings.autoDeleteDays)
    
    // Delete old links for this user
    const result = await Link.deleteMany({
      userId: userId,
      createdAt: { $lt: cutoffDate }
    })
    
    return { 
      success: true, 
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} old links`
    }
  } catch (error) {
    console.error('Error cleaning up expired links for user:', error)
    return { success: false, error: error.message }
  }
}
