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
  
  // App Catalog Enhancement - Phase 2
  shortDescription?: string; // Brief one-liner for cards
  longDescription?: string; // Detailed description for app pages
  screenshots?: string[]; // Array of screenshot URLs
  features?: string[]; // Key features list
  tags?: string[]; // Tags for filtering and search
  website?: string; // Official website URL
  supportUrl?: string; // Support/help URL
  integrationStatus: 'ready' | 'beta' | 'coming_soon'; // Integration readiness
  popularity?: number; // Usage popularity score (0-100)
  rating?: number; // User rating (1-5)
  isPopular?: boolean; // Featured/popular app flag
  isFeatured?: boolean; // Featured on homepage
  launchInNewTab?: boolean; // Open in new tab vs iframe
  
  // SSO Integration
  apiKey?: string; // API key for SSO validation requests
  
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
  },
  // App Catalog Enhancement - Phase 2
  shortDescription: {
    type: String,
    maxlength: 150
  },
  longDescription: {
    type: String,
    maxlength: 2000
  },
  screenshots: [{
    type: String,
    maxlength: 500
  }],
  features: [{
    type: String,
    maxlength: 100
  }],
  tags: [{
    type: String,
    maxlength: 30
  }],
  website: {
    type: String,
    maxlength: 300
  },
  supportUrl: {
    type: String,
    maxlength: 300
  },
  integrationStatus: {
    type: String,
    enum: ['ready', 'beta', 'coming_soon'],
    default: 'ready'
  },
  popularity: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  launchInNewTab: {
    type: Boolean,
    default: false
  },
  // SSO Integration
  apiKey: {
    type: String,
    maxlength: 100,
    sparse: true // Allow null values, but enforce uniqueness when present
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export const App = mongoose.models.App || mongoose.model<IApp>('App', AppSchema);