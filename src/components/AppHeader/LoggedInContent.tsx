import { Button, Flex, Text } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { clearAuthData } from "../../auth/redux";

interface LoggedInContentProps {
    firstName: string;
}

export default function LoggedInContent({ firstName }: LoggedInContentProps) {
    const dispatch = useDispatch();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const onLogOut = useCallback(async () => {
        setIsDisabled(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        dispatch(clearAuthData());
    }, [dispatch]);

    return (
        <Flex flexDir="row" marginRight={8} gap={4} alignItems="center">
            <Text>Hello, {firstName}</Text>
            <Button isLoading={isDisabled} onClick={onLogOut}>
                Log Out
            </Button>
        </Flex>
    );
}
