import { CreateTimetable } from "@/interface"
import api from "./api"

export const getTimetableForClass = (classId: string) => {
    return api.get(`/timetable/${classId}`)
}

export const createTimetable = ({ classId, day, periods } : CreateTimetable) => {
    return api.post('/timetable/create-timetable', { classId, day, periods })
}