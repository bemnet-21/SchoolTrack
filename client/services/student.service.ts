import { RegisterStudent, StudentProps } from "@/interface";
import api from "./api";

export const registerStudent = ( data: StudentProps ) => {
    return api.post('/students/register', data)
}

export const getStudentsPerClass = ( classId: string ) => {
    return api.get(`/students/class/${classId}`)
}

export const getAllStudents = () => {
    return api.get('/students')
}

export const getStudentProfile = ( studentId: string ) => {
    return api.get(`/students/profile/${studentId}`)
}

export const updateStudentProfile = (studentId: string, { studentDob, studentEmail, studentFirstName, studentLastName, studentGender, classId, parentEmail, parentName, parentPhone, studentAddress }:StudentProps) => {
    return api.put(`/students/${studentId}`, { studentDob, studentEmail, studentFirstName, studentLastName, studentGender, classId, parentEmail, parentName, parentPhone, studentAddress })
}

export const getTodaySchedule = (day: string) => {
    return api.get(`/students/get-today-schedule?day=${day}`)
}