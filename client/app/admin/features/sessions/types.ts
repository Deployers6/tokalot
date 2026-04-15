export interface TeacherOption {
  id: string;
  fullName: string;
}

export interface Booking {
  id: string;
  clerkId: string;
  sectionId: string;
  status: boolean;
  isTrial: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  title: string;
  level: string;
  teacherId: string;
  teacher?: { fullName: string };
  StartTime: string;
  endTime: string;
  capacity: number;
  status: boolean;
  bookings?: Booking[];
}

export interface SessionEditorValues {
  title: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  capacity: string;
  teacherId: string;
}

export interface ClerkUser {
  clerkId: string;
  fullName: string;
  email?: string;
  membershipStatus?: string;
}
