import { connectDB } from './connection';
import { App } from './schemas/app';

export async function updateErpNextPlanRequirement() {
  await connectDB();

  try {
    // Update the existing ERPNext app to require Starter plan (level 2) instead of Pro
    const result = await App.updateOne(
      { slug: 'business-suite' },
      { 
        minimumPlanLevel: 2,  // Starter plan (position 2)
        requiresPlan: true
      }
    );

    if (result.matchedCount > 0) {
      console.log('✅ Updated ERPNext app to require Starter plan (level 2)');
      return { success: true, message: 'ERPNext plan requirement updated' };
    } else {
      console.log('❌ ERPNext app not found');
      return { success: false, message: 'ERPNext app not found' };
    }
  } catch (error) {
    console.error('Error updating ERPNext plan requirement:', error);
    return { success: false, message: 'Failed to update ERPNext plan requirement' };
  }
}

// Run this function if executed directly
if (require.main === module) {
  updateErpNextPlanRequirement().then(result => {
    console.log(result);
    process.exit(0);
  });
}
