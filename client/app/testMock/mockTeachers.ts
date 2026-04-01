let teachers = [
  {
    name: "Sarah Jenkins",
    subject: "Advanced Mathematics",
    experience: "Senior",
    tags: ["FULL-TIME", "ROOM 302"],
    image: "",
  },
  {
    name: "David Miller",
    subject: "History & Ethics",
    experience: "Mid-Level",
    tags: ["PART-TIME", "ROOM 105"],
    image: "",
  },
];

export const getTeachers = async () => {
  return new Promise<typeof teachers>((resolve) =>
    setTimeout(() => resolve(teachers), 200),
  );
};

export const addTeacher = async (teacher: any) => {
  return new Promise((resolve) => {
    teachers.push(teacher);
    setTimeout(() => resolve(teacher), 200);
  });
};
