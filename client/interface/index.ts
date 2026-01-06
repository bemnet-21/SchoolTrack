export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
  exp: number;
}

export interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
}