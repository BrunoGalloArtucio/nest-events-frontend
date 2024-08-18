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
    useRadioGroup,
    HStack,
} from "@chakra-ui/react";
import { AttendeeAnswerEnum, Event } from "../../types/events";
import { useAuthData } from "../../auth/redux";
import { RadioCard } from "../../components/RadioCard";

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
        <Flex flexDir="column" alignItems="center" pt={8}>
            <Stack w="75%" gap={4}>
                <Skeleton maxH={32} isLoaded={isLoaded} fadeDuration={0.5}>
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

    const isLoaded = useMinDelay(700, !isPending || isSuccess);

    if (!authData) {
        return null;
    }

    return (
        <Flex flexDir="row">
            <Skeleton h={20} isLoaded={isLoaded} fadeDuration={0.5}>
                {isSuccess && (
                    <EventAttendanceComponent
                        eventId={eventId}
                        attendance={attendance}
                    />
                )}
            </Skeleton>
        </Flex>
    );
}

const options = [
    { value: String(AttendeeAnswerEnum.Accepted), label: "Yes" },
    { value: String(AttendeeAnswerEnum.Maybe), label: "Maybe" },
    { value: String(AttendeeAnswerEnum.Rejected), label: "No" },
];

interface EventAttendanceComponentProps {
    eventId: number;
    attendance: AttendeeAnswerEnum | null;
}

function EventAttendanceComponent({
    attendance,
    eventId,
}: EventAttendanceComponentProps) {
    const { mutateAsync: attendEvent } = useAttendEvent(eventId);

    const onAttendanceChange = useCallback(
        async (newAttendance: string) => {
            if (String(attendance) === newAttendance) {
                return;
            }
            await attendEvent({ answer: Number(newAttendance) });
        },
        [attendEvent, attendance]
    );

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: "attendance",
        defaultValue: attendance ? String(attendance) : "",
        onChange: onAttendanceChange,
    });

    const group = getRootProps();

    return (
        <Flex borderRadius={8} bg="yellow.100" flexDir="column" gap={2} p={4}>
            <Text as="b" fontSize="lg">
                Are you attending?
            </Text>
            <HStack {...group}>
                {options.map(({ value, label }) => {
                    const radio = getRadioProps({ value });
                    return (
                        <RadioCard key={value} {...radio}>
                            {label}
                        </RadioCard>
                    );
                })}
            </HStack>
        </Flex>
    );
}
