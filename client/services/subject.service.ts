import api from "./api"

export const getAllSubjects = () => {
    return api.get('/subjects')
}

export const addSubject = (name: string) => {
    return api.post('/subjects', { name })
}