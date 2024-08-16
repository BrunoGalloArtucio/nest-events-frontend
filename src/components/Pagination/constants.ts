import { ButtonProps } from "@chakra-ui/react";

export const INITIAL_VALUES = {
    pagesQuantity: undefined,
    currentPage: 1,
    normalStyles: {},
    separatorStyles: {},
    activeStyles: {},
    isDisabled: false,
    innerLimit: 0,
    separatorIcon: undefined,
    outerLimit: 0,
    hoverIconLeft: undefined,
    hoverIconRight: undefined,
};

export const SEPARATORS = {
    left: 0,
    right: -1,
};

// styles
const baseStyles: ButtonProps = {
    w: 7,
    fontSize: "sm",
};

export const normalStyles: ButtonProps = {
    ...baseStyles,
    _hover: {
        bg: "blue.500",
    },
    bg: "gray.300",
};

export const activeStyles: ButtonProps = {
    ...baseStyles,
    _hover: {
        cursor: "default",
    },
    bg: "blue.300",
};

export const separatorStyles: ButtonProps = {
    w: 7,
    bg: "green.200",
};
