export interface UserData {
    username: string;
    purpose: string;
    isMinor: boolean;
    interests: string[];
}

export enum AgeGroup {
    Adults = 'adults',
    Minors = 'minors',
}

export enum UserStatus {
    Idle = 'idle',
    Paired = 'paired',
    Pending = 'pending',
}

export type UsersCollection = Map<AgeGroup, Map<UserStatus, Map<string, UserData>>>;
export type GetUsersCollectionResult = [(id: string, data: UserData) => void, (id: string) => void, (id: string, newStatus: UserStatus) => void];