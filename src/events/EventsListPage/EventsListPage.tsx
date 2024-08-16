import { useEvents } from "../../api/events";
import { usePageParam } from "../../common/hooks/use-page-param";
import EventList from "../../components/EventList/EventList";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Stack, Heading, Skeleton } from "@chakra-ui/react";
import { ITEMS_PER_PAGE } from "../../common/constants";
import { useMinDelay } from "../../common/hooks/use-min-delay";

export default function Events() {
    const page = usePageParam();
    console.log("PAGE: ", page);
    const { data: queryData, isPending, isSuccess } = useEvents(page);
    const [totalEvents, setTotalEvents] = useState<number>(0);
    const [, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (isSuccess) {
            setTotalEvents(queryData.total);
        }
    }, [isSuccess, queryData]);

    const onPageChange = useCallback(
        (page: number) => {
            setSearchParams((params) => {
                const newParams = new URLSearchParams(params);
                newParams.set("page", String(page));

                return newParams;
            });
        },
        [setSearchParams]
    );

    const isLoaded = useMinDelay(700, !isPending || isSuccess);

    return (
        <Box display="flex" flexDir="column" alignItems="center" gap={4}>
            <Heading as="h1">Upcoming Events</Heading>
            <Stack w="75%">
                {!isLoaded && (
                    <Box
                        display="flex"
                        flexDir="row"
                        justifyContent="center"
                        gap={2}
                    >
                        <Skeleton
                            h={10}
                            w={7}
                            borderRadius="var(--chakra-radii-md)"
                        />
                        <Skeleton
                            h={10}
                            w={7}
                            borderRadius="var(--chakra-radii-md)"
                        />
                        <Skeleton
                            h={10}
                            w={7}
                            borderRadius="var(--chakra-radii-md)"
                        />
                    </Box>
                )}
                <Skeleton h={32} isLoaded={isLoaded} fadeDuration={0.5}>
                    <EventList
                        total={totalEvents}
                        events={queryData?.data ?? []}
                        page={page}
                        onPageChange={onPageChange}
                    />
                </Skeleton>
                {!isLoaded &&
                    Array.from({ length: ITEMS_PER_PAGE - 1 }).map((_, i) => (
                        <Skeleton key={i} h={32} />
                    ))}
            </Stack>
        </Box>
    );
}
