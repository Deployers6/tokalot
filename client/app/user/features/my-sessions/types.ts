export interface UserBooking {
  id: string;
  status: boolean;
  cancelledAt?: string;
  updatedAt: string;
  section: {
    id: string;
    title: string;
    level: string;
    StartTime: string;
    endTime: string;
  };
}
