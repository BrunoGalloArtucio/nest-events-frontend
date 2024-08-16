import {
    Box,
    useDisclosure,
    Popover,
    PopoverTrigger,
    Button,
    PopoverContent,
    Input,
    Text,
    Flex,
} from "@chakra-ui/react";
import { useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useLogIn } from "../../api/auth";
import { setAuthData } from "../../auth/redux";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function LoggedOutContent() {
    return (
        <Flex display="flex" flexDir="row" gap={4}>
            <SignUpButton />
            <LogInButton />
        </Flex>
    );
}

interface LogInFormValues {
    username: string;
    password: string;
}

function LogInButton() {
    const {
        isOpen: isLogInMenuOpen,
        onClose: closeLogInMenu,
        onOpen: openLogInMenu,
    } = useDisclosure();
    const logInButtonRef = useRef<HTMLButtonElement>(null);

    const { mutateAsync } = useLogIn();

    const dispatch = useDispatch();

    const onLogIn = useCallback(
        async ({ username, password }: LogInFormValues) => {
            const authData = await mutateAsync({
                username,
                password,
            });
            dispatch(setAuthData(authData));
        },
        [dispatch, mutateAsync]
    );

    const {
        errors,
        handleSubmit,
        handleChange,
        handleBlur,
        isSubmitting,
        isValid,
        touched,
        status,
    } = useFormik<LogInFormValues>({
        initialValues: {
            username: "",
            password: "",
        },
        validateOnMount: true,
        validationSchema: Yup.object().shape({
            username: Yup.string().min(2).required(),
            password: Yup.string().min(8).required(),
        }),
        onSubmit: async (values, { setStatus }) => {
            try {
                await onLogIn(values);
            } catch (error) {
                setStatus({
                    errorMessage: "Invalid credentials",
                });
            }
        },
    });

    return (
        <>
            <Popover
                isOpen={isLogInMenuOpen}
                onClose={closeLogInMenu}
                onOpen={openLogInMenu}
                placement="bottom-start"
            >
                <PopoverTrigger>
                    <Button ref={logInButtonRef}>Log In</Button>
                </PopoverTrigger>
                <form onSubmit={handleSubmit}>
                    <PopoverContent
                        display="flex"
                        flexDir="column"
                        gap={4}
                        bg="aliceblue"
                        p={4}
                        borderRadius={8}
                    >
                        <Input
                            name="username"
                            placeholder="Username"
                            size="sm"
                            variant="outline"
                            bg="white"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errorBorderColor="red.500"
                            isInvalid={!!errors.username && touched.username}
                            data-testid="log-in-username-field"
                        />

                        <Input
                            name="password"
                            placeholder="Password"
                            size="sm"
                            type="password"
                            variant="outline"
                            bg="white"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errorBorderColor="red.500"
                            isInvalid={!!errors.password && touched.password}
                            data-testid="log-in-password-field"
                        />
                        <Box h={0.5} color="red.300" textAlign={"center"}>
                            {status?.errorMessage && (
                                <Text>{status.errorMessage}</Text>
                            )}
                        </Box>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            isDisabled={!isValid}
                            colorScheme="teal"
                            data-testid="log-in-button"
                        >
                            Log In
                        </Button>
                    </PopoverContent>
                </form>
            </Popover>
        </>
    );
}

function SignUpButton() {
    const {
        isOpen: isSignUpMenuOpen,
        onClose: closeSignUpMenu,
        onToggle: openSignUpMenu,
    } = useDisclosure();
    const logInButtonRef = useRef<HTMLButtonElement>(null);
    return (
        <Popover
            isOpen={isSignUpMenuOpen}
            onClose={closeSignUpMenu}
            onOpen={openSignUpMenu}
        >
            <PopoverTrigger>
                <Button ref={logInButtonRef}>Sign Up</Button>
            </PopoverTrigger>
            <PopoverContent
                display="flex"
                flexDir="column"
                gap={4}
                bg="aliceblue"
                p={4}
                borderRadius={8}
            >
                <Input placeholder="Username" size="sm" bg="white" />
                <Input placeholder="email" size="sm" bg="white" type="email" />
                <Input placeholder="First Name" size="sm" bg="white" />
                <Input placeholder="Last Name" size="sm" bg="white" />
                <Input
                    placeholder="Password"
                    size="sm"
                    bg="white"
                    type="password"
                />
                <Input
                    placeholder="Repeat Password"
                    size="sm"
                    bg="white"
                    type="password"
                />
                <Button colorScheme="teal">Sign Up</Button>
            </PopoverContent>
        </Popover>
    );
}
