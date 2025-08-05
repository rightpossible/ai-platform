import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSubscription extends Document {
  _id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due' | 'trialing';
  startDate: Date;
  endDate?: Date; // For cancelled subscriptions
  stripeSubscriptionId?: string;
  isYearly: boolean;
  trialEndsAt?: Date; // For trial subscriptions
  cancelledAt?: Date; // When subscription was cancelled
  createdAt: Date;
  updatedAt: Date;
}

const UserSubscriptionSchema = new Schema<IUserSubscription>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  planId: {
    type: String,
    required: true,
    ref: 'SubscriptionPlan'
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'cancelled', 'expired', 'past_due', 'trialing'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  stripeSubscriptionId: {
    type: String,
    maxlength: 100
  },
  isYearly: {
    type: Boolean,
    default: false
  },
  trialEndsAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Index for efficient queries
UserSubscriptionSchema.index({ userId: 1, status: 1 });
UserSubscriptionSchema.index({ planId: 1 });
UserSubscriptionSchema.index({ stripeSubscriptionId: 1 }, { unique: true, sparse: true });

export const UserSubscription = mongoose.models.UserSubscription || mongoose.model<IUserSubscription>('UserSubscription', UserSubscriptionSchema);