import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  _id: string;
  teamId: string;
  userId?: string;
  action: string;
  timestamp: Date;
  ipAddress?: string;
}

const ActivityLogSchema = new Schema<IActivityLog>({
  teamId: {
    type: String,
    required: true,
    ref: 'Team'
  },
  userId: {
    type: String,
    ref: 'User'
  },
  action: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    maxlength: 45
  }
});

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);