import api from "./api";

export const getDashboardStats = () => {
    return api.get("/dashboard/stats");
}

export const getAllEvents = () => {
    return api.get("/events")
}

export const getStudentPerformance = (grade : string) => {
    return api.get(`/dashboard/performance?grade=${grade}`)
}