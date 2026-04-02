export type Teacher = {
  id: number;
  name: string;
  level: string;
  bio: string;
  specialties: string[];
  tags: string[];
  image: string;
};

let teachers: Teacher[] = [
  {
    id: 1,
    name: "Temka",
    level: "Basic",
    bio: "Experienced English teacher for beginners.",
    specialties: ["IELTS Prep", "Business English"],
    tags: ["English", "Beginner"],
    image: "/default-profile.png",
  },
  {
    id: 2,
    name: "Sara",
    level: "Advanced",
    bio: "Advanced level teacher with 5+ years of experience.",
    specialties: ["TOEFL", "Conversation"],
    tags: ["English", "Advanced"],
    image: "/default-profile.png",
  },
  {
    id: 3,
    name: "John",
    level: "Intermediate",
    bio: "Intermediate teacher, focuses on speaking skills.",
    specialties: ["Grammar", "Writing"],
    tags: ["English", "Intermediate"],
    image: "/default-profile.png",
  },
];

export const getTeachers = async (): Promise<Teacher[]> =>
  new Promise((res) => setTimeout(() => res([...teachers]), 200));

export const addTeacher = async (teacher: Omit<Teacher, "id">) => {
  const newTeacher: Teacher = { ...teacher, id: Date.now() };
  teachers.push(newTeacher);
  return newTeacher;
};

export const updateTeacher = async (
  id: number,
  updated: Partial<Omit<Teacher, "id">>,
) => {
  const index = teachers.findIndex((t) => t.id === id);
  if (index !== -1) {
    teachers[index] = { ...teachers[index], ...updated };
    return teachers[index];
  }
  throw new Error("Teacher not found");
};

export const deleteTeacher = async (id: number) => {
  teachers = teachers.filter((t) => t.id !== id);
};
