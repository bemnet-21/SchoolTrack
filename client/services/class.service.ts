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