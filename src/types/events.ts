export type Event = {
    id: number;
    name: string;

    description: string;

    when: string;

    address: string;

    organizerId: number;

    attendeeCount?: number;
    attendeeAccepted?: number;
    attendeeMaybe?: number;
    attendeeRejected?: number;
};

export enum AttendeeAnswerEnum {
    Accepted = 1,
    Maybe,
    Rejected,
}
