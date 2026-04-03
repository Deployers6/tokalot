let teachers: Teacher[] = [
  {
    id: 1,
    name: "Temka",
    subject: "English",
    level: "Basic",
    bio: "",
    specialties: ["IELTS Prep", "Business English"],
    tags: ["Speaking", "Grammar"],
    image: "/default-profile.png",
  },
  {
    id: 2,
    name: "Sara",
    subject: "Math",
    level: "Advanced",
    bio: "",
    specialties: ["Calculus", "Algebra"],
    tags: ["Problem Solving", "Logic"],
    image: "/default-profile.png",
  },
];

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  level: string;
  bio: string;
  specialties: string[];
  tags: string[];
  image: string;
}

export const getTeachers = async () => {
  return [...teachers];
};

export const addTeacher = async (teacher: Omit<Teacher, "id">) => {
  const newTeacher = { ...teacher, id: Date.now() };
  teachers.push(newTeacher);
  return newTeacher;
};

export const updateTeacher = async (
  id: number,
  updated: Omit<Teacher, "id">,
) => {
  teachers = teachers.map((t) => (t.id === id ? { ...t, ...updated } : t));
};

export const deleteTeacher = async (id: number) => {
  teachers = teachers.filter((t) => t.id !== id);
};
