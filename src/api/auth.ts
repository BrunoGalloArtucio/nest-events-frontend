import { useMutation } from "@tanstack/react-query";
import { typedFetch } from "./utils";
import { AuthData } from "../types/AuthData";
import { ApiError } from "./types";

export const useLogIn = () =>
    useMutation<AuthData, ApiError, { username: string; password: string }>({
        mutationFn: ({ username, password }) =>
            typedFetch<AuthData>("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password,
                }),
            }),
    });
