import { DataRegistrationPayload } from '../socket/socket.types';
import { AgeGroup, GetUsersCollectionResult, User, UserData, UserStatus, UsersCollection } from '../types';

export function getUsersCollection(): GetUsersCollectionResult {
    const collection: UsersCollection = new Map([
        [AgeGroup.Adults, new Map([
            [UserStatus.Idle, new Map<string, User>()],
            [UserStatus.Paired, new Map<string, User>()],
            [UserStatus.Pending, new Map<string, User>()],
        ])],
        [AgeGroup.Minors, new Map([
            [UserStatus.Idle, new Map<string, User>()],
            [UserStatus.Paired, new Map<string, User>()],
            [UserStatus.Pending, new Map<string, User>()],
        ])],
    ]);

    const addUser = (id: string, user: User) => {
        const ageGroup = user.userData.isMinor ? AgeGroup.Minors : AgeGroup.Adults;
        const status = UserStatus.Idle;

        const collectionChunk = collection.get(ageGroup)?.get(status);

        if (collectionChunk) {
            collectionChunk.set(id, user);
        }
    }

    const removeUser = (id: string) => {
        for (const [ageGroup, statusMap] of collection.entries()) {
            for (const [status, userMap] of statusMap.entries()) {
                if (userMap.has(id)) {
                    userMap.delete(id);
                    return;
                }
            }
        }
    };

    const switchUserStatus = (id: string, newStatus: UserStatus) => {
        for (const [ageGroup, statusMap] of collection.entries()) {
            for (const [status, userMap] of statusMap.entries()) {
                if (userMap.has(id)) {
                    const userData = userMap.get(id);
                    userMap.delete(id);

                    const newStatusMap = collection.get(ageGroup)?.get(newStatus);
                    if (newStatusMap && userData) {
                        newStatusMap.set(id, userData);
                    }

                    return;
                }
            }
        }
    };

    return [addUser, removeUser, switchUserStatus];
}

