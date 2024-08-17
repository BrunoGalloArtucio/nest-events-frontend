import { useNavigate, useParams } from "react-router-dom";
import { useAttendEvent, useEvent, useEventAttendance } from "../../api/events";
import { useCallback, useEffect, useState } from "react";
import { useMinDelay } from "../../common/hooks/use-min-delay";
import {
    Heading,
    Stack,
    Skeleton,
    Flex,
    Text,
    RadioGroup,
    Radio,
} from "@chakra-ui/react";
import { AttendeeAnswerEnum, Event } from "../../types/events";
import { useAuthData } from "../../auth/redux";

export default function EventPage() {
    const params = useParams<{ eventId: string }>();
    const [eventId, setEventId] = useState<number>();
    const navigate = useNavigate();

    useEffect(() => {
        const { eventId } = params;

        if (!eventId || isNaN(Number(eventId))) {
            navigate("/");
        } else {
            setEventId(Number(eventId));
        }
    }, [navigate, params]);

    const { data: event, isPending, isSuccess } = useEvent(eventId);
    const isLoaded = useMinDelay(700, !isPending || isSuccess);

    return (
        <Flex flexDir="column" alignItems="center" gap={4} pt={8}>
            <Stack w="75%">
                <Skeleton h={32} isLoaded={isLoaded} fadeDuration={0.5}>
                    {event && <EventComponent event={event} />}
                </Skeleton>
                {eventId !== undefined ? (
                    <EventAttendance eventId={eventId} />
                ) : null}
            </Stack>
        </Flex>
    );
}

interface EventProps {
    event: Event;
}

function EventComponent({ event }: EventProps) {
    return (
        <Flex flexDir="column" bg="yellow.100" p={4} borderRadius={4}>
            <Flex flexDir="row" alignItems="center" justify="space-between">
                <Heading as="h1">{event.name}</Heading>
                <Flex flexDir="column" alignItems="flex-end">
                    <Text fontSize="lg">
                        {new Date(event.when).toLocaleString()}{" "}
                    </Text>
                    <Text>{event.address}</Text>
                </Flex>
            </Flex>
            <Text>{event.description}</Text>
        </Flex>
    );
}

interface EventAttendanceProps {
    eventId: number;
}

function EventAttendance({ eventId }: EventAttendanceProps) {
    const authData = useAuthData();
    const {
        data: attendance,
        isPending,
        isSuccess,
    } = useEventAttendance(eventId, authData?.userId);

    const { mutateAsync: attendEvent } = useAttendEvent(eventId);

    const isLoaded = useMinDelay(700, !isPending || isSuccess);

    const onAttendanceChange = useCallback(
        async (newAttendance: string) => {
            console.log(
                `newAttendance: ${typeof newAttendance} - ${newAttendance}`
            );
            console.log(`attendance: ${typeof attendance} - ${attendance}`);
            if (String(attendance) === newAttendance) {
                return;
            }
            await attendEvent({ answer: Number(newAttendance) });
        },
        [attendEvent, attendance]
    );

    const options = [
        { value: String(AttendeeAnswerEnum.Accepted), label: "Yes" },
        { value: String(AttendeeAnswerEnum.Maybe), label: "Maybe" },
        { value: String(AttendeeAnswerEnum.Rejected), label: "No" },
    ];

    if (!authData) {
        return null;
    }

    console.log(`attendance: ${attendance}`);

    return (
        <Flex flexDir="row">
            <Skeleton h={8} isLoaded={isLoaded} fadeDuration={0.5}>
                <Flex bg="yellow.100" flexDir="column" gap={2}>
                    <Text>Are you attending?</Text>
                    <RadioGroup onChange={onAttendanceChange}>
                        <Stack direction="row">
                            {options.map(({ label, value }) => {
                                console.log(
                                    `isChecked ${value}: ${
                                        value === String(attendance)
                                    }`
                                );
                                return (
                                    <Radio
                                        key={value}
                                        value={value}
                                        isChecked={value === String(attendance)}
                                    >
                                        {label}
                                    </Radio>
                                );
                            })}
                        </Stack>
                    </RadioGroup>
                </Flex>
            </Skeleton>
        </Flex>
    );
}
