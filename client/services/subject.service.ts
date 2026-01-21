import api from "./api"

export const getAllSubjects = () => {
    return api.get('/subjects')
}