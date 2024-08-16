import Modal from "../Modal";
import styles from "./CreateEventModal.module.scss";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { useFormik } from "formik";
import * as Yup from "yup";

import "react-datepicker/dist/react-datepicker.css";
import { CreateEventFormData, useCreateEvent } from "../../api/events";

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateEventModal({
    isOpen,
    onClose,
}: CreateEventModalProps) {
    const navigate = useNavigate();

    const { mutateAsync } = useCreateEvent();

    const onEventCreated = useCallback(
        async (eventData: CreateEventFormData) => {
            const createdEvent = await mutateAsync(eventData);
            onClose();
            navigate(`/events/${createdEvent.id}`);
        },
        [mutateAsync, navigate, onClose]
    );

    const {
        handleSubmit,
        handleChange,
        handleBlur,
        errors,
        touched,
        status,
        isSubmitting,
        isValid,
        resetForm,
        values,
        setFieldValue,
    } = useFormik<CreateEventFormData>({
        initialValues: {
            address: "",
            description: "",
            name: "",
            when: undefined,
        },
        onSubmit: async (values, { setStatus }) => {
            try {
                await onEventCreated(values);
            } catch (error) {
                setStatus({
                    errorMessage: "Something went wrong. Please try again",
                });
            }
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required().min(5),
            description: Yup.string().required().min(5),
            address: Yup.string().required().min(5),
            when: Yup.date().required(),
        }),
    });

    const onCancelClick = useCallback(() => {
        resetForm();
        onClose();
    }, [onClose, resetForm]);

    return (
        <Modal title="Create Event" isOpen={isOpen} onClose={onClose}>
            <form className={styles.container} onSubmit={handleSubmit}>
                <Input
                    name="name"
                    placeholder="Name"
                    size="sm"
                    variant="outline"
                    bg="white"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.name && !!touched.name}
                    errorBorderColor="red.500"
                />
                <Textarea
                    name="description"
                    placeholder="Description"
                    size="sm"
                    variant="outline"
                    bg="white"
                    rows={5}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.description && !!touched.description}
                    errorBorderColor="red.500"
                />
                <Input
                    name="address"
                    placeholder="Address"
                    size="sm"
                    variant="outline"
                    bg="white"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.address && !!touched.address}
                    errorBorderColor="red.500"
                />

                <DatePicker
                    name="when"
                    selected={values.when}
                    onChange={(date) => setFieldValue("when", date)}
                    showTimeSelect
                    minDate={new Date()}
                    timeIntervals={15}
                    placeholderText="Select date"
                    dateFormat="Pp"
                    timeFormat="p"
                    className={styles.datePicker}
                />
                {status?.errorMessage ? (
                    <div className={styles.errorMessage}>
                        <Text>{status.errorMessage}</Text>
                    </div>
                ) : null}
                <Flex flexDir="row" justifyContent="flex-end" gap={4}>
                    <Button
                        variant="host"
                        colorScheme="red"
                        size="m"
                        disabled={isSubmitting}
                        onClick={onCancelClick}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        colorScheme="teal"
                        isDisabled={!isValid}
                        isLoading={isSubmitting}
                        type="submit"
                    >
                        Create
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
}
