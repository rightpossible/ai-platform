import mongoose from 'mongoose';

export interface ISSOToken extends mongoose.Document {
  userId: string;
  targetApp: string;
  tokenHash: string; // Store hash of token, not the actual token
  nonce: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

const ssoTokenSchema = new mongoose.Schema<ISSOToken>(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    targetApp: {
      type: String,
      required: true,
      index: true
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true
    },
    nonce: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    usedAt: {
      type: Date,
      default: null
    },
    ipAddress: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index for efficient queries
ssoTokenSchema.index({ userId: 1, targetApp: 1, createdAt: -1 });

// TTL index to automatically delete expired tokens
ssoTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SSOToken = mongoose.models.SSOToken || mongoose.model<ISSOToken>('SSOToken', ssoTokenSchema);