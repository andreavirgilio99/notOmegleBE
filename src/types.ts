import { Socket } from "socket.io";

export interface User {
    userData: UserData;
    peerId: string;
    socket: Socket;
    camPartner?: Socket
}

export interface UserData {
    username: string;
    purpose: string;
    isMinor: boolean;
    interests: string[];
}

export enum SearchStatus {
    Ongoing = "ongoing",
    Stopped = "stopped"
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
    camPartner?: Socket;
}

export type SearchStartResult = {
    thisUser: User;
    userToPair: User;
    sharedInterests: string[];
}

export type GetUsersCollectionResult = [
    (client: Socket, data: User) => void, //addUser
    (id: string) => RemoveUserResult, //removeUser
    (id: string, oldStatus: UserStatus, ageGroup: AgeGroup, newStatus: UserStatus) => void, //switchUserStatus
    (id: string, ageGroup: AgeGroup, interests: string[]) => Promise<SearchStartResult | undefined>, //searchStart
    (id: string) => void //searchCancel
];