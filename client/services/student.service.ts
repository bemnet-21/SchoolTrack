import { RegisterStudent, StudentProps } from "@/interface";
import api from "./api";

export const registerStudent = ( data: StudentProps ) => {
    return api.post('/students/register', data)
}

export const getStudentsPerClass = ( classId: string ) => {
    return api.get(`/students/class/${classId}`)
}