import { Event } from "../../types/events";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import Pagination from "../Pagination/Pagination";
import { Flex, Text } from "@chakra-ui/react";

interface EventListProps {
    events: Event[];
    page: number;
    total: number;
    onPageChange: (page: number) => void;
}

export default function EventList({
    events,
    total,
    page,
    onPageChange,
}: EventListProps) {
    return (
        <Flex flexDir="column" gap={8} width="100%">
            <Flex justifyContent="center">
                <Pagination
                    currentPage={page}
                    onPageChange={onPageChange}
                    totalElements={total}
                />
            </Flex>
            <Flex flexDir="column" gap={4}>
                {events.map((event) => (
                    <EventListItem key={event.id} event={event} />
                ))}
            </Flex>
        </Flex>
    );
}

interface EventListItemProps {
    event: Event;
}

function EventListItem({ event }: EventListItemProps) {
    const navigate = useNavigate();

    const onEventClick = useCallback(
        () => navigate(`/events/${event.id}`),
        [event.id, navigate]
    );

    return (
        <Flex
            p={4}
            bg="antiquewhite"
            borderRadius={8}
            cursor="pointer"
            onClick={onEventClick}
            flexDir="column"
            gap={4}
            transition="0.1s ease-in-out"
            _hover={{
                filter: "brightness(95%)",
                transform: "scale(1.05)",
            }}
        >
            <Flex flexDir="row" gap={2}>
                <Flex flex={1}>
                    <Text as="b" fontSize="2xl" data-testid="event-title">
                        {event.name}
                    </Text>
                </Flex>
                <Text>{new Date(event.when).toDateString()}</Text>
            </Flex>
            <Text>{event.description}</Text>
        </Flex>
    );
}
