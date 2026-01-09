export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
  name: string;
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

export interface PillProps {
  label: string;
  className?: string;
}

export interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  iconClassName?: string;
  iconBgColor?: string;
}

export interface Stats {
  totalStudents: string;
  totalTeachers: string;
  totalClasses: string;
}

export interface Event {
  id: string
  title: string
  event_date: string
  start_time: string
  end_time: string
}

export interface EventsCard {
  events: Event[]
}

export interface Performance {
  subject: string
  average: number
}
export interface PerformanceCardProps {
  performance: Performance[],
  grade: string
}