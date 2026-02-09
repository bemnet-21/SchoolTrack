import { MenuItem } from "@/interface";
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield, FaHome, FaCalendarAlt, FaBook, FaCalendarWeek, FaClipboardList } from "react-icons/fa";
import { FaChildren, FaFileInvoiceDollar } from "react-icons/fa6";



export const adminMenuItems: MenuItem[] = [
  { name: "Dashboard", path: "/admin", icon: FaHome },
  { name: "Teachers", path: "/admin/teachers", icon: FaChalkboardTeacher },
  { name: "Students", path: "/admin/students", icon: FaUserGraduate },
  { name: "Subjects", path: "/admin/subjects", icon: FaBook },
  { name: "Grades", path: "/admin/grades", icon: FaClipboardList },
  { name: "Classes", path: "/admin/classes", icon: FaUserGraduate },
  { name: "Timetable", path: "/admin/timetable", icon: FaCalendarWeek },
  { name: "Fees", path: "/admin/fees", icon: FaFileInvoiceDollar },
  { name: "Events", path: "/admin/events", icon: FaCalendarAlt },
];

export const teacherMenuItems: MenuItem[] = [
  { name: "Dashboard", path: "/teacher", icon: FaHome },
  { name: "Classes", path: "/teacher/classes", icon: FaChalkboardTeacher },
  { name: "Schedule", path: "/teacher/schedule", icon: FaCalendarAlt },
//   { name: "Attendance", path: "/teacher/attendance", icon: FaCalendarAlt },
];

export const studentMenuItems: MenuItem[] = [
  { name: "Dashboard", path: "/student", icon: FaHome },
  { name: "Grades", path: "/student/grades", icon: FaBook },
  // { name: "Attendance", path: "/student/attendance", icon: FaCalendarAlt },
  { name: "Schedule", path: "/student/schedule", icon: FaCalendarAlt },
];

export const parentMenuItems: MenuItem[] = [
  { name: "Dashboard", path:"/parent", icon: FaHome },
  { name: "My Children", path: "/parent/my-children", icon: FaChildren },
  { name: "Fees", path: "/parent/fees", icon: FaFileInvoiceDollar },
  
]