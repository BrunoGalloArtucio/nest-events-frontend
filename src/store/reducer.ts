import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../auth/redux";

export const rootReducer = combineReducers({
    auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
