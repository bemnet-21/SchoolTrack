import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import sidebarReducer from "./slices/sidebar.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;