import { ReactNode } from "react";
import {
    Modal as ChakraUiModal,
    Heading,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children?: ReactNode;
}

export default function Modal({
    title,
    isOpen,
    children,
    onClose,
}: ModalProps) {
    return (
        <ChakraUiModal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
                display="flex"
                flexDir="column"
                gap={1}
                width="500px"
                pos="absolute"
                bg="aliceblue"
            >
                <ModalHeader display="flex" justifyContent="center">
                    <Heading as="h2">{title}</Heading>
                </ModalHeader>
                <ModalBody>{children}</ModalBody>
            </ModalContent>
        </ChakraUiModal>
    );
}
