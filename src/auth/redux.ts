import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthData } from "../types/AuthData";
import { useAppSelector } from "../store/hooks";

const authData = localStorage.getItem("authData");
const initialState = {
    authData: authData ? (JSON.parse(authData) as AuthData) : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<AuthData>) => {
            state.authData = action.payload;
            localStorage.setItem("authData", JSON.stringify(action.payload));
        },
        clearAuthData: (state) => {
            state.authData = null;
            localStorage.removeItem("authData");
        },
    },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;

export function useAuthData() {
    return useAppSelector((state) => state.auth.authData);
}

export function useIsAuthenticated() {
    return useAppSelector((state) => !!state.auth.authData);
}
