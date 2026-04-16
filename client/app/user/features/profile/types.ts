export interface MembershipSummary {
  status: string;
  startDate: string | null;
  endDate: string | null;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
}
