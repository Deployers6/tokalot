export type MembershipStatus = "ACTIVE" | "PENDING" | "EXPIRED";

export interface HistoryItem {
  id: string;
  action: string;
  change: number;
  createdAt: string;
}

export interface UserDetail {
  clerkId: string;
  fullName: string;
  email?: string;
  image?: string;
}

export interface MembershipData {
  clerkId: string;
  startDate?: string;
  endDate?: string;
  totalSessions: number;
  usedSessions: number;
  status: string;
  history: HistoryItem[];
}
