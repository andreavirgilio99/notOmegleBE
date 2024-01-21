import { User, UserData, UserStatus } from "../types";

export interface DataRegistrationPayload {
    data: User;
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