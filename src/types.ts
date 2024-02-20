import { Socket } from "socket.io";

export interface User {
    userData: UserData;
    peerId: string;
    socketId?: string;
    socket?: Socket;
    camPartner?: Socket
}

export interface UserData {
    username: string;
    purpose: string;
    isMinor: boolean;
    interests: string[];
}

export interface Message {
    sender: string; //sender username
    content: string;
    to: string; //receiver socketId
}

export enum SearchStatus {
    Ongoing = 'ongoin',
    Stopped = 'stopped'
}

export enum AgeGroup {
    Adults = 'adults',
    Minors = 'minors',
}

export enum UserStatus {
    Idle = 'idle',
    Paired = 'paired',
    Pending = 'pending'
}

export type UsersCollection = Map<AgeGroup, Map<UserStatus, Map<string, User>>>;

export type RemoveUserResult = {
    wasPaired: boolean;
    wasMinor: boolean
    camPartner?: Socket;
}

export type SearchStartResult = {
    thisUser: User;
    userToPair: User;
    sharedInterests: string[];
}
export type AddUserFunction = (client: Socket, data: User) => void
export type RemoveUserFunction = (id: string) => RemoveUserResult
export type SwitchUserStatusFunction = (id: string, oldStatus: UserStatus, ageGroup: AgeGroup, newStatus: UserStatus) => void
export type SearchStartFunction = (id: string, ageGroup: AgeGroup, interests: string[]) => Promise<SearchStartResult | undefined>
export type SearchCancelFunction = (id: string) => void
export type GetUserFunction = (id: string, status: UserStatus, ageGroup: AgeGroup) => User | undefined

export type UserCollectionHandlers = [
    AddUserFunction,
    GetUserFunction,
    RemoveUserFunction,
    SwitchUserStatusFunction,
    SearchStartFunction,
    SearchCancelFunction
];