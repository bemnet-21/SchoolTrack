import { LoginUser } from "@/interface";
import api from "./api";

export const login = (data : LoginUser) => {
    return api.post("/auth/login", data);
}

export const changePassword = (newPassword: string) => {
    return api.post("/auth/change-password", { newPassword});
}

