import mongoose, { Schema, Document } from 'mongoose';

export interface IPlanApp extends Document {
  _id: string;
  planId: string;
  appId: string;
  isIncluded: boolean; // True if app is included in plan
  createdAt: Date;
  updatedAt: Date;
}

const PlanAppSchema = new Schema<IPlanApp>({
  planId: {
    type: String,
    required: true,
    ref: 'SubscriptionPlan'
  },
  appId: {
    type: String,
    required: true,
    ref: 'App'
  },
  isIncluded: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Ensure unique combination of plan and app
PlanAppSchema.index({ planId: 1, appId: 1 }, { unique: true });

export const PlanApp = mongoose.models.PlanApp || mongoose.model<IPlanApp>('PlanApp', PlanAppSchema);