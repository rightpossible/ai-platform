import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name?: string;
  email: string;
  passwordHash?: string; // Optional for Auth0 users
  auth0Id?: string; // Auth0 user ID
  picture?: string; // Profile picture URL
  emailVerified?: boolean;
  role: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Subscription fields
  currentPlanId?: string; // Reference to active subscription plan
  subscriptionStatus?: string; // 'active', 'cancelled', 'expired', 'past_due', 'trialing'
  trialEndsAt?: Date; // For trial users

  deletedAt?: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255
  },
  passwordHash: {
    type: String,
    required: false // Not required for Auth0 users
  },
  auth0Id: {
    type: String,
    unique: true,
    sparse: true // Allow null values, but enforce uniqueness when present
  },
  picture: {
    type: String
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  role: {
    type: String,
    required: true,
    default: 'member',
    enum: ['member', 'platform_admin', 'app_admin'],
    maxlength: 20
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Subscription fields
  currentPlanId: {
    type: String,
    ref: 'SubscriptionPlan'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'past_due', 'trialing'],
    maxlength: 20
  },
  trialEndsAt: {
    type: Date
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);