import { AddTeacherInterface, UpdateTeacher } from "@/interface"
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

export const updateTeacherProfile = (teacherId: string, { name, teacherEmail, phone, subject }:UpdateTeacher) => {
    return api.put(`/teachers/${teacherId}`, { name, teacherEmail, phone, subject })
}

export const getClassOfTeacher = () => {
    return api.get('/teachers/get-class')
}

export const getTodaySchedule = () => {
    return api.get('/teachers/get-today-schedule')
}