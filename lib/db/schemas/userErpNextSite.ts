import mongoose, { Schema, Document } from 'mongoose';

export interface IUserErpNextSite extends Document {
  _id: string;
  userId: string; // Reference to the user
  username: string; // ERPNext site username (subdomain)
  siteUrl: string; // Full URL to the ERPNext site
  adminPassword: string; // User's chosen password for their site
  email: string; // User's email
  status: 'creating' | 'active' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

const UserErpNextSiteSchema = new Schema<IUserErpNextSite>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        // Ensure username follows safe naming convention
        return /^[a-z0-9]+$/.test(v) && v.length >= 6;
      },
      message: 'Username must be at least 6 characters and contain only lowercase letters and numbers'
    }
  },
  siteUrl: {
    type: String,
    required: true,
    maxlength: 300
  },
  adminPassword: {
    type: String,
    required: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    maxlength: 200
  },
  status: {
    type: String,
    required: true,
    enum: ['creating', 'active', 'suspended'],
    default: 'creating'
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Add indexes for performance and uniqueness
UserErpNextSiteSchema.index({ userId: 1, status: 1 });

// Ensure one active site per user
UserErpNextSiteSchema.index(
  { userId: 1, status: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { status: { $in: ['creating', 'active'] } },
    name: 'one_active_site_per_user'
  }
);

export const UserErpNextSite = mongoose.models.UserErpNextSite || mongoose.model<IUserErpNextSite>('UserErpNextSite', UserErpNextSiteSchema);
