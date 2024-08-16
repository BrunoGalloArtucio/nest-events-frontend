import { env } from "../common/env/env.override";
import store from "../store/store";
import { ApiError } from "./types";

const API_URL = env.VITE_EVENTS_API_URL as string;

export function apiUrl(endpoint: string) {
    return new URL(endpoint, API_URL);
}

export async function typedFetch<T>(path: string, init?: RequestInit) {
    const response = await fetch(apiUrl(path), {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...init?.headers,
        },
    });

    if (response.ok) {
        return (await response.json()) as T;
    }

    throw new ApiError(response.status, "Error fetching data from " + path);
}

export async function authTypedFetch<T>(path: string, init?: RequestInit) {
    const token = store.getState().auth.authData?.token;
    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }

    return await typedFetch<T>(path, {
        ...init,
        headers: {
            ...init?.headers,
            Authorization: `Bearer ${token}`,
        },
    });
}
