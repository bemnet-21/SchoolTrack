import { AddEvent } from "@/interface"
import api from "./api"

export const getAllEvents = () => {
    return api.get("/events")
}

export const addEvent = ({ title, startTime, endTime, eventDate } : AddEvent) => {
    return api.post('/events/add-event', { title, startTime, endTime, eventDate })
}