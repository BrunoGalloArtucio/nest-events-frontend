import { ITEMS_PER_PAGE } from "../common/constants";
import { AttendeeAnswerEnum, Event } from "../types/events";
import { PaginationResult } from "../types/pagination";
import { ApiError } from "./types";
import { authTypedFetch, typedFetch } from "./utils";
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

export function useEvents(page: number) {
    console.log("useEvent: ", page);
    return useQuery({
        queryKey: ["events", page],
        queryFn: () => {
            const offset = (page - 1) * ITEMS_PER_PAGE;
            const limit = ITEMS_PER_PAGE;
            return typedFetch<PaginationResult<Event>>(
                `events?limit=${limit}&offset=${offset}`
            );
        },
        staleTime: 1000 * 60,
        placeholderData: keepPreviousData,
    });
}

export function useEvent(eventId?: number) {
    return useQuery({
        queryKey: ["events", eventId],
        queryFn: async () => {
            return await typedFetch<Event>(`events/${eventId}`);
        },
        staleTime: 1000 * 60,
        placeholderData: keepPreviousData,
        enabled: !!eventId,
    });
}

export interface CreateEventFormData {
    name: string;
    description: string;
    when?: Date;
    address: string;
}

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation<Event, ApiError, CreateEventFormData>({
        mutationFn: async (event) => {
            return await authTypedFetch<Event>("/events", {
                method: "POST",
                body: JSON.stringify(event),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events", 1] });
        },
    });
}

export function useEventAttendance(eventId: number, userId?: number) {
    return useQuery({
        queryKey: ["me", "events-attendance", eventId],
        queryFn: async () => {
            try {
                const { answer } = await authTypedFetch<{
                    answer: AttendeeAnswerEnum;
                }>(`me/events-attendance/${eventId}`);

                return answer;
            } catch (err) {
                if (err instanceof ApiError && err.statusCode === 404) {
                    return null;
                }
                throw err;
            }
        },
        staleTime: 1000 * 60,
        placeholderData: keepPreviousData,
        enabled: !!userId,
    });
}

type CreateAttendee = {
    answer: AttendeeAnswerEnum;
};

export function useAttendEvent(eventId: number) {
    const queryClient = useQueryClient();
    return useMutation<void, ApiError, CreateAttendee>({
        mutationFn: async (attendee) => {
            return await authTypedFetch<void>(
                `me/events-attendance/${eventId}`,
                {
                    method: "PUT",
                    body: JSON.stringify(attendee),
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["me", "events-attendance", eventId],
            });
        },
    });
}
