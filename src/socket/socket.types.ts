import { Message, User, UserData, UserStatus } from "../types";

export interface DataRegistrationPayload {
    data: User;
}

export interface LeaveCallPayload {
    status: UserStatus;
    isMinor: boolean;
}

export interface SuccessfulPairingPayload {
    camPartner: User;
    sharedInterests: string[];
    youCall: boolean; //determines wheter this user will be the caller or the receiver
}

export interface SearchStartPayload {
    data: UserData;
    status: UserStatus;
}

//used for both message events
export interface MessageEventPayload {
    data: Message;
}