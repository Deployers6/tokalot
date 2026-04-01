export type Session = {
  id: number;
  title: string;
  teacherName: string;
  level: string;
  startTime: string;
  endTime: string;
  capacity: number;
  availableSeats: number;
  date: string; // "YYYY-MM-DD"
  status: boolean;
};

// Backend бэлэн болмогц энэ функцийг fetch() болгож солино
export async function getSessions(): Promise<Session[]> {
  return mockSessions;
}

export const mockSessions: Session[] = [
  {
    id: 1,
    title: "Daily Coffee Talk",
    teacherName: "Teacher 1",
    level: "Intermediate Level",
    startTime: "09:00",
    endTime: "10:30",
    capacity: 15,
    availableSeats: 3,
    date: "2026-04-01",
    status: true,
  },
  {
    id: 2,
    title: "Advanced Business English",
    teacherName: "Teacher 2",
    level: "Advanced Level",
    startTime: "11:00",
    endTime: "12:30",
    capacity: 12,
    availableSeats: 7,
    date: "2026-04-01",
    status: true,
  },
  {
    id: 3,
    title: "IELTS Speaking Mastery",
    teacherName: "Teacher 3",
    level: "Intermediate Level",
    startTime: "14:00",
    endTime: "15:30",
    capacity: 10,
    availableSeats: 10,
    date: "2026-04-01",
    status: true,
  },
  {
    id: 4,
    title: "Daily Coffee Talk",
    teacherName: "Teacher 1",
    level: "Beginner Level",
    startTime: "09:00",
    endTime: "10:30",
    capacity: 15,
    availableSeats: 5,
    date: "2026-04-02",
    status: true,
  },
  {
    id: 5,
    title: "TOEFL Speaking Practice",
    teacherName: "Teacher 2",
    level: "Advanced Level",
    startTime: "10:00",
    endTime: "11:30",
    capacity: 8,
    availableSeats: 2,
    date: "2026-04-02",
    status: true,
  },
  {
    id: 6,
    title: "Early Stage English",
    teacherName: "Teacher 4",
    level: "Beginner Level",
    startTime: "13:00",
    endTime: "14:00",
    capacity: 15,
    availableSeats: 15,
    date: "2026-04-03",
    status: true,
  },
];
