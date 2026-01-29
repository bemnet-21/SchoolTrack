import { AddClassInterface, AssignSubjectsToClassInterface } from "@/interface"
import api from "./api"

export const getClassId = (grade : string) => {
    return api.get(`/class/get-class-id?grade=${grade}`)
}

export const getAllClasses = () => {
    return api.get('/class')
}

export const getClassDetail = (id : string) => {
    return api.get(`/class/${id}`)
}

export const addClass = ({ grade, name, teacherId }: AddClassInterface) => {
    return api.post('/class', { grade, name, teacherId })
}

export const assignSubjectsToClass = ({ classId, subjects }:AssignSubjectsToClassInterface) => {
    return api.post('/class/assign-subjects', { classId, subjects })
}