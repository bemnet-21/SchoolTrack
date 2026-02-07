import { AddGrade } from "@/interface"
import api from "./api"

export const addGrade = ({ score, studentId, classId, term} : AddGrade) => {
    return api.post('/grade/add-grade', { score, studentId, classId, term })
}

export const getGrades = (classId: string, term: number) => {
    return api.get(`/grade/get-grades/?classId=${classId}&term=${term}`)
}

export const getGradeForStudent = (term: number, studentId?:string) => {
    return api.get(`/grade/student-get-grade/?term=${term}&studentId=${studentId}`)
}