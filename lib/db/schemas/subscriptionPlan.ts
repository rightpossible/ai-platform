import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriptionPlan extends Document {
  _id: string;
  name: string; // "Starter", "Professional", "Enterprise"
  slug: string; // "starter", "professional", "enterprise"
  description: string;
  price: number; // Monthly price in cents
  yearlyPrice?: number; // Yearly price in cents (optional)
  features: string[]; // Array of feature descriptions
  maxUsers: number; // -1 for unlimited
  storageQuota: number; // GB, -1 for unlimited
  isActive: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  stripeYearlyPriceId?: string;
  position: number; // For ordering plans
  isPopular?: boolean; // Highlight popular plans
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  yearlyPrice: {
    type: Number,
    min: 0
  },
  features: [{
    type: String,
    maxlength: 200
  }],
  maxUsers: {
    type: Number,
    required: true,
    default: -1 // -1 means unlimited
  },
  storageQuota: {
    type: Number,
    required: true,
    default: -1 // -1 means unlimited, otherwise in GB
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stripeProductId: {
    type: String,
    maxlength: 100
  },
  stripePriceId: {
    type: String,
    maxlength: 100
  },
  stripeYearlyPriceId: {
    type: String,
    maxlength: 100
  },
  position: {
    type: Number,
    default: 0
  },
  isPopular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export const SubscriptionPlan = mongoose.models.SubscriptionPlan || mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);