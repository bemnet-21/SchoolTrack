import api from "./api"

export const getAllTeachers = () => {
    return api.get('/teachers')
}