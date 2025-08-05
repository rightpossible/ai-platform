// Export all schemas and interfaces
export { User, type IUser } from './user';
export { Team, type ITeam } from './team';
export { TeamMember, type ITeamMember } from './teamMember';
export { ActivityLog, type IActivityLog } from './activityLog';
export { Invitation, type IInvitation } from './invitation';
export { SSOToken, type ISSOToken } from './ssoToken';
export { App, type IApp } from './app';
export { SubscriptionPlan, type ISubscriptionPlan } from './subscriptionPlan';
export { UserSubscription, type IUserSubscription } from './userSubscription';
export { PlanApp, type IPlanApp } from './planApp';

// Activity types enum
export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}

// Import types for internal usage and aliases
import type { IUser } from './user';
import type { ITeam } from './team';
import type { ITeamMember } from './teamMember';
import type { IActivityLog } from './activityLog';
import type { IInvitation } from './invitation';

// Type definitions for compatibility
export type UserType = IUser;
export type TeamType = ITeam;
export type TeamMemberType = ITeamMember;
export type ActivityLogType = IActivityLog;
export type InvitationType = IInvitation;

export type TeamDataWithMembers = ITeam & {
  teamMembers: (ITeamMember & {
    user: Pick<IUser, '_id' | 'name' | 'email'>;
  })[];
};