import { RegisterStudent } from "@/interface";
import api from "./api";

export const registerStudent = ( { data } : RegisterStudent ) => {
    return api.post('/students/register', data)
}