import { createSlice } from "@reduxjs/toolkit";

export type Role = "admin" | "teacher" | "student" | "parent";

interface AuthState {
    user: any | null;
    token: string | null;
    role: Role | null;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    role: null,
    loading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,  
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        }}
    });  