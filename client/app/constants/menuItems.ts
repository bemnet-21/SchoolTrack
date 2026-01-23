import { MenuItem } from "@/interface";
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield, FaHome, FaCalendarAlt, FaBook } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";



export const adminMenuItems: MenuItem[] = [
  { name: "Dashboard", path: "/admin", icon: FaHome },
  { name: "Teachers", path: "/admin/teachers", icon: FaChalkboardTeacher },
  { name: "Students", path: "/admin/students", icon: FaUserGraduate },
  { name: "Classes", path: "/admin/classes", icon: FaUserGraduate },
  { name: "Fees", path: "/admin/fees", icon: FaFileInvoiceDollar },
];

export const teacherMenuItems: MenuItem[] = [
  { name: "Dashboard", path: "/teacher", icon: FaHome },
  { name: "Classes", path: "/teacher/classes", icon: FaChalkboardTeacher },
//   { name: "Attendance", path: "/teacher/attendance", icon: FaCalendarAlt },
];

export const studentMenuItems: MenuItem[] = [
  { name: "Dashboard", path: "/student", icon: FaHome },
  { name: "Grades", path: "/student/grades", icon: FaBook },
  { name: "Attendance", path: "/student/attendance", icon: FaCalendarAlt },
  { name: "Schedule", path: "/student/schedule", icon: FaCalendarAlt },
];