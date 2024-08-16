import { useAuthData } from "../../auth/redux";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CreateEventModal from "../CreateEventModal/CreateEventModal";
import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import LoggedInContent from "./LoggedInContent";
import LoggedOutContent from "./LoggedOutContent";

export default function AppHeader() {
    const authData = useAuthData();
    const navigate = useNavigate();
    const {
        isOpen: isCreateEventModalOpen,
        onClose: onCreateEventModalClose,
        onToggle: toggleCreateEventModal,
    } = useDisclosure();

    const onHomeClick = useCallback(() => {
        navigate("/");
    }, [navigate]);

    return (
        <>
            <Flex
                w="100%"
                h={12}
                bg="gainsboro"
                justifyContent="space-between"
                alignItems="center"
                paddingX={16}
                paddingY={2}
            >
                <Button variant="ghost" onClick={onHomeClick}>
                    Home
                </Button>
                {authData && (
                    <Button onClick={toggleCreateEventModal}>
                        Create Event
                    </Button>
                )}
                <Box>
                    {authData ? (
                        <LoggedInContent firstName={authData.firstName} />
                    ) : (
                        <LoggedOutContent />
                    )}
                </Box>
            </Flex>
            <CreateEventModal
                isOpen={isCreateEventModalOpen}
                onClose={onCreateEventModalClose}
            />
        </>
    );
}
