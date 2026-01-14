import api from "./api"

export const getClassId = (grade : string) => {
    return api.get(`/class/get-class-id?grade=${grade}`)
}