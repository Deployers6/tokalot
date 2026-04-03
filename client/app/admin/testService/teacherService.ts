import {
  getTeachers,
  addTeacher,
  updateTeacher,
} from "../testMock/mockTeachers";

export const teacherService = {
  getTeachers: async () => {
    const res = await getTeachers();
    return res;
  },

  addTeacher: async (data: any) => {
    return await addTeacher(data);
  },

  updateTeacher: async (id: string, data: any) => {
    return await updateTeacher(Number(id), data);
  },
};
