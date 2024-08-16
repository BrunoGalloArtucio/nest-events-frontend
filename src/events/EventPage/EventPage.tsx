import { useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../../api/events";
import { useEffect, useState } from "react";
import { useMinDelay } from "../../common/hooks/use-min-delay";
import { Heading, Stack, Skeleton, Flex, Text } from "@chakra-ui/react";
import { Event } from "../../types/events";

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
