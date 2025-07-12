import dbConnect from './mongodb';
import User from '@/models/User';
import Link from '@/models/Link';

export interface UserLimits {
  canCreateLink: boolean;
  canUploadFile: boolean;
  maxFileSize: number;
  totalFileSizeUsed: number;
  linksUsed: number;
  linksLimit: number;
  plan: string;
  adCredits: number;
}

export async function getUserLimits(userId: string): Promise<UserLimits> {
  try {
    await dbConnect();
    
    // Get or create user
    let user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({ 
        userId, 
        email: `user-${userId}@example.com`, // You'll need to get actual email from Clerk
        plan: 'free' 
      });
    }
    
    // Count current links
    const linksCount = await Link.countDocuments({ userId });
    
    // Calculate total file size used
    const userLinks = await Link.find({ userId, isFile: true });
    let totalFileSize = 0;
    for (const link of userLinks) {
      if (link.files && Array.isArray(link.files)) {
        for (const file of link.files) {
          totalFileSize += file.size || 0;
        }
      }
    }
    
    // Business Rule: linksCreated should only increase, never decrease
    // This ensures that deleting links doesn't free up slots for free users
    const currentLinksCreated = user.linksCreated || 0;
    const maxLinksCreated = Math.max(currentLinksCreated, linksCount);
    
    // Update user's links count and total file size
    await User.findOneAndUpdate(
      { userId },
      { 
        linksCreated: maxLinksCreated, // Never decreases
        totalFileSize: totalFileSize
      }
    );
    
    const baseLimitReached = user.planLimits.maxLinks !== -1 && maxLinksCreated >= user.planLimits.maxLinks;
    const canCreateLink = user.planLimits.maxLinks === -1 || maxLinksCreated < user.planLimits.maxLinks || user.adCredits > 0;
    const canUploadFile = user.plan === 'premium' || user.planLimits.maxFileSize > 0;
    
    return {
      canCreateLink,
      canUploadFile,
      maxFileSize: user.planLimits.maxFileSize,
      totalFileSizeUsed: totalFileSize,
      linksUsed: maxLinksCreated, // Show the cumulative count, not current count
      linksLimit: user.planLimits.maxLinks,
      plan: user.plan,
      adCredits: user.adCredits,
    };
  } catch (error) {
    console.error('Error getting user limits:', error);
    // Return default free limits on error
    return {
      canCreateLink: true,
      canUploadFile: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      linksUsed: 0,
      linksLimit: 5,
      plan: 'free',
      adCredits: 0,
    };
  }
}

export async function upgradeToPremium(userId: string, subscriptionId: string): Promise<boolean> {
  try {
    await dbConnect();
    
    await User.findOneAndUpdate(
      { userId },
      {
        plan: 'premium',
        subscriptionId,
        subscriptionStatus: 'active',
      },
      { upsert: true }
    );
    
    return true;
  } catch (error) {
    console.error('Error upgrading to premium:', error);
    return false;
  }
}

export async function downgradeToFree(userId: string): Promise<boolean> {
  try {
    await dbConnect();
    
    await User.findOneAndUpdate(
      { userId },
      {
        plan: 'free',
        subscriptionId: null,
        subscriptionStatus: 'inactive',
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error downgrading to free:', error);
    return false;
  }
}

export async function checkFileUploadLimit(userId: string, newFiles: any[]): Promise<{canUpload: boolean, totalSizeAfter: number, error?: string}> {
  try {
    const userLimits = await getUserLimits(userId);
    
    // Calculate size of new files
    let newFilesSize = 0;
    for (const file of newFiles) {
      newFilesSize += file.size || 0;
    }
    
    const totalSizeAfter = userLimits.totalFileSizeUsed + newFilesSize;
    
    // Check if premium (unlimited)
    if (userLimits.plan === 'premium' || userLimits.maxFileSize === -1) {
      return { canUpload: true, totalSizeAfter };
    }
    
    // Check total file size limit for free users
    if (totalSizeAfter > userLimits.maxFileSize) {
      const totalSizeMB = Math.round(totalSizeAfter / 1024 / 1024);
      const limitMB = Math.round(userLimits.maxFileSize / 1024 / 1024);
      const usedMB = Math.round(userLimits.totalFileSizeUsed / 1024 / 1024);
      
      return { 
        canUpload: false, 
        totalSizeAfter,
        error: `Total file storage limit exceeded. You've used ${usedMB}MB and this upload would make it ${totalSizeMB}MB, but your limit is ${limitMB}MB. Upgrade to Premium for unlimited storage.`
      };
    }
    
    return { canUpload: true, totalSizeAfter };
  } catch (error) {
    console.error('Error checking file upload limit:', error);
    return { canUpload: false, totalSizeAfter: 0, error: 'Error checking limits' };
  }
}
