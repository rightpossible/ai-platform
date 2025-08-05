import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
  _id: string;
  userId: string;
  teamId: string;
  role: string;
  joinedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  teamId: {
    type: String,
    required: true,
    ref: 'Team'
  },
  role: {
    type: String,
    required: true,
    maxlength: 50
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

export const TeamMember = mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);