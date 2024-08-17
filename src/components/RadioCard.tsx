import { Box, useRadio } from "@chakra-ui/react";
import * as _chakra_ui_react_types from "@chakra-ui/react-types";

export function RadioCard(
    props: _chakra_ui_react_types.InputDOMProps &
        React.AriaAttributes &
        React.DOMAttributes<HTMLInputElement> &
        _chakra_ui_react_types.DataAttributes & {
            id?: string;
            role?: React.AriaRole;
            tabIndex?: number;
            style?: React.CSSProperties;
        }
) {
    const { getInputProps, getRadioProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getRadioProps();

    // console.log(props);

    return (
        <Box as="label">
            <input {...input} />
            <Box
                {...checkbox}
                cursor="pointer"
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                bg="white"
                _checked={{
                    bg: "teal.600",
                    color: "white",
                    borderColor: "teal.600",
                }}
                _focus={{
                    boxShadow: "outline",
                }}
                px={1}
                py={1}
            >
                {props.children}
            </Box>
        </Box>
    );
}
