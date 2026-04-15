import {
  getTeachers,
  addTeacher,
  updateTeacher,
  type Teacher,
} from "../lib/mockTeachers";

type TeacherInput = Omit<Teacher, "id">;

export const teacherService = {
  getTeachers: async () => {
    const res = await getTeachers();
    return res;
  },

  addTeacher: async (data: TeacherInput) => {
    return await addTeacher(data);
  },

  updateTeacher: async (id: string, data: TeacherInput) => {
    return await updateTeacher(Number(id), data);
  },
};
