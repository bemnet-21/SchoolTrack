export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: "admin" | "teacher" | "student" | "parent";
  exp: number;
}