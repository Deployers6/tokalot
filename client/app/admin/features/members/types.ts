export interface AdminMember {
  clerkId: string;
  fullName: string;
  email?: string;
  image?: string;
  isMember: boolean;
  membershipStatus?: string;
  membershipEnd?: string;
  remainingSessions?: number;
  isExpired?: boolean;
  createdAt?: string;
}
