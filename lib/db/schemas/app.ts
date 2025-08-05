import mongoose, { Schema, Document } from 'mongoose';

export interface IApp extends Document {
  _id: string;
  name: string;
  slug: string;
  ssoUrl: string;
  description?: string;
  status: 'active' | 'inactive';
  icon?: string;
  color?: string;
  
  // Plan-related fields
  requiresPlan: boolean; // Whether app requires a paid plan
  minimumPlanLevel?: number; // Minimum plan level required (0=free, 1=starter, 2=pro, 3=enterprise)
  category?: string; // App category for organization
  
  createdAt: Date;
  updatedAt: Date;
}

const AppSchema = new Schema<IApp>({
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
  ssoUrl: {
    type: String,
    required: true,
    maxlength: 500
  },
  description: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  icon: {
    type: String,
    maxlength: 100
  },
  color: {
    type: String,
    maxlength: 50
  },
  // Plan-related fields
  requiresPlan: {
    type: Boolean,
    default: false
  },
  minimumPlanLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 3
  },
  category: {
    type: String,
    maxlength: 50,
    default: 'business'
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export const App = mongoose.models.App || mongoose.model<IApp>('App', AppSchema);