import { AddTeacherInterface } from "@/interface"
import api from "./api"

export const getAllTeachers = () => {
    return api.get('/teachers')
}

export const addTeacher = ({ name, teacherEmail, teacherPhone, subjectId } : AddTeacherInterface) => {
    return api.post('/teachers/register', { name, teacherEmail, teacherPhone, subjectId })
}

export const getTeacherById = (teacherId: string) => {
    return api.get(`/teachers/${teacherId}`)
}