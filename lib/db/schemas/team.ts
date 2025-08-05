import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeProductId?: string;
  planName?: string;
  subscriptionStatus?: string;
}

const TeamSchema = new Schema<ITeam>({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  stripeCustomerId: {
    type: String,
    unique: true,
    sparse: true
  },
  stripeSubscriptionId: {
    type: String,
    unique: true,
    sparse: true
  },
  stripeProductId: {
    type: String
  },
  planName: {
    type: String,
    maxlength: 50
  },
  subscriptionStatus: {
    type: String,
    maxlength: 20
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);