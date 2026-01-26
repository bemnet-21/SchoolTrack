import { AddGrade } from "@/interface"
import api from "./api"

export const addGrade = ({ score, studentId, subjectId, term} : AddGrade) => {
    return api.post('/grades/add-grade', { score, studentId, subjectId, term })
}

export const getGrades = (classId: string, term: number) => {
    return api.get(`/grade/get-grades/?classId=${classId}&term=${term}`)
}