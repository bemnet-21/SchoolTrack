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

export interface StudentProps {
  studentEmail: string
  parentEmail: string
  parentName: string
  parentPhone: string
  studentFirstName: string
  studentLastName: string
  studentGender: string
  studentDob: string
  classId: string | null
  joined?: string
}

export interface StudentDetail {
  id: string;
  studentfirstname: string;
  studentlastname: string;
  studentdob: string;
  studentgender: string;
  studentaddress: string | null;
  class: string | null; 
  grade: string | null;
  parentname: string;
  parentphone: string;
  parentemail: string;
}

export interface GetStudentsProps {
  studentfirstname: string
  studentlastname: string
  studentgender: string
  studentdob: string
  id: string
  joined?:string
  class?:string
}

export interface CredentialDetails {
  email: string
  temporaryPassword: string
}

export interface RegistrationSuccessData {
  student: CredentialDetails
  parent: CredentialDetails
}

export interface RegisterStudent {
  data: StudentProps
}

export interface ClassProps {
  id: string
  grade: string
  name: string
  teacher_name: string
  student_count: number
}

export interface TeacherProps {
  id: string
  name: string
  email: string
  phone: string
  subject_name: string | null
}

export interface TeacherDetail {
  teachername: string
  teacheremail: string
  teacherphone: string
  subject: string | null
}

export interface AddClassInterface {
  grade: string
  name: string
  teacherId: string
}

export interface AddTeacherInterface {
  name: string
  teacherEmail: string
  teacherPhone: string
  subjectId: string
}
export interface TeacherCredentials {
    email: string;
    temporaryPassword: string;
}
export interface SubjectProps {
  id: string
  name: string
}

export interface AssignFee {
  classId: string
  amount: number
  term: number
  year: number
  startDate: string
  dueDate: string
}

export interface FeeProps {
  id: string
  amount: number
  start_date: string
  due_date: string
  is_paid: boolean
  invoice_no: string
  first_name: string
  last_name: string
  parent_phone: string
}