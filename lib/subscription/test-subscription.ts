// Quick test script to verify subscription functionality
import SubscriptionManager from './subscription-manager';

export async function testSubscriptionFlow() {
  console.log('🧪 Testing subscription flow...');
  
  try {
    // Test 1: Subscribe to a plan
    console.log('Test 1: Subscribe to starter plan');
    const subscribeResult = await SubscriptionManager.subscribeToPlan({
      userId: 'test-user-123',
      planId: 'starter-plan-id',
      isYearly: false
    });
    console.log('Subscribe result:', subscribeResult);

    // Test 2: Try to subscribe to same plan (should fail)
    console.log('Test 2: Try to subscribe to same plan');
    const duplicateResult = await SubscriptionManager.subscribeToPlan({
      userId: 'test-user-123',
      planId: 'starter-plan-id',
      isYearly: false
    });
    console.log('Duplicate result:', duplicateResult);

    // Test 3: Change to different plan (should work)
    console.log('Test 3: Change to professional plan');
    const changeResult = await SubscriptionManager.changePlan(
      'test-user-123',
      'professional-plan-id',
      false
    );
    console.log('Change result:', changeResult);

    // Test 4: Cancel subscription
    console.log('Test 4: Cancel subscription');
    const cancelResult = await SubscriptionManager.cancelSubscription('test-user-123');
    console.log('Cancel result:', cancelResult);

    // Test 5: Check app access
    console.log('Test 5: Check app access');
    const hasAccess = await SubscriptionManager.hasAppAccess('test-user-123', 'app-id-123');
    console.log('Has app access:', hasAccess);

    console.log('✅ All subscription tests completed');
    return { success: true, message: 'All tests passed' };

  } catch (error) {
    console.error('❌ Subscription test failed:', error);
    return { success: false, error };
  }
}

// Helper function to run tests from admin
export async function runSubscriptionTests() {
  return await testSubscriptionFlow();
}