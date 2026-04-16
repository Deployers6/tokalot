export interface TeacherFormValues {
  fullName: string;
  experience: string;
  bio: string;
  imageUrl: string;
}

export interface TeacherRecord extends TeacherFormValues {
  id: string;
}
