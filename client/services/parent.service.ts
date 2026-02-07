import api from "./api"

export const getChildren = () => {
    return api.get('/parents/get-children')
}