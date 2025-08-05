import mongoose, { Schema, Document } from 'mongoose';

export interface IInvitation extends Document {
  _id: string;
  teamId: string;
  email: string;
  role: string;
  invitedBy: string;
  invitedAt: Date;
  status: string;
}

const InvitationSchema = new Schema<IInvitation>({
  teamId: {
    type: String,
    required: true,
    ref: 'Team'
  },
  email: {
    type: String,
    required: true,
    maxlength: 255
  },
  role: {
    type: String,
    required: true,
    maxlength: 50
  },
  invitedBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  invitedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    maxlength: 20
  }
});

export const Invitation = mongoose.models.Invitation || mongoose.model<IInvitation>('Invitation', InvitationSchema);