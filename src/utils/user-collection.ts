import { Socket } from 'socket.io';
import { AgeGroup, UserCollectionHandlers, RemoveUserResult, SearchStartResult, SearchStatus, User, UserStatus, UsersCollection } from '../types';
import { findCommonInterests } from './find-common-interests';

export function getUserCollectionHandlers(): UserCollectionHandlers {
    const pendingSearchs = new Map<string, SearchStatus>();
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

    const addUser = (client: Socket, user: User) => {
        user.socket = client;
        user.socketId = client.id;
        const ageGroup = user.userData.isMinor ? AgeGroup.Minors : AgeGroup.Adults;
        const status = UserStatus.Idle;

        const collectionChunk = collection.get(ageGroup)?.get(status);

        if (collectionChunk) {
            collectionChunk.set(client.id, user);
        }
    }

    //can't be optimized coz can't send data payload during disconnection
    const removeUser = (id: string) => {
        const result: RemoveUserResult = {
            wasPaired: false,
            wasMinor: false,
            camPartner: undefined
        }

        for (const [ageGroup, statusMap] of collection.entries()) {
            for (const [status, userMap] of statusMap.entries()) {
                if (userMap.has(id)) {
                    if (status == UserStatus.Paired) {
                        result.wasPaired = true;
                        result.wasMinor = userMap.get(id)!.userData.isMinor;
                        result.camPartner = userMap.get(id)!.camPartner;
                    }
                    userMap.delete(id);
                    return result;
                }
            }
        }

        console.log("user not found during user removal")
        return result; //should be unreachable
    };

    const switchUserStatus = (id: string, oldStatus: UserStatus, ageGroup: AgeGroup, newStatus: UserStatus) => {
        const ageGroupChunk = collection.get(ageGroup);

        if (ageGroupChunk) {
            const oldStatusChunk = ageGroupChunk.get(oldStatus);

            if (oldStatusChunk) {
                const user = oldStatusChunk.get(id);
                oldStatusChunk.delete(id);

                const newStatusChunk = ageGroupChunk.get(newStatus);

                if (newStatusChunk && user) {

                    if (newStatus != UserStatus.Paired) {
                        user.camPartner = undefined;
                    }

                    newStatusChunk.set(id, user)
                }
                else {
                    console.log("User not found during status switch");
                }
            }
        }
    };

    const getUser = (id: string, status: UserStatus, ageGroup: AgeGroup): User | undefined => {
        const ageGroupChunk = collection.get(ageGroup);

        if (ageGroupChunk) {
            const statusChunk = ageGroupChunk.get(status);

            if (statusChunk) {
                const user = statusChunk.get(id);
                return user;
            }
        }
    };

    const startSearch = async (id: string, ageGroup: AgeGroup, interests: string[]): Promise<SearchStartResult | undefined> => {
        return new Promise<SearchStartResult | undefined>((resolve) => {
            let result: SearchStartResult | undefined = undefined;
            pendingSearchs.set(id, SearchStatus.Ongoing);
            let thisUser: User | undefined = undefined;

            const interval = setInterval(() => {
                if (result) {
                    clearInterval(interval);
                    if (thisUser) {
                        thisUser.camPartner = result.userToPair.socket;
                        result.userToPair.camPartner = thisUser!.socket;
                        switchUserStatus(result.userToPair.socket!.id, UserStatus.Pending, ageGroup, UserStatus.Paired);
                        pendingSearchs.delete(id);
                        resolve(result);
                    }
                    else { //user disconnected while searching
                        clearInterval(interval);
                        pendingSearchs.delete(id);
                        resolve(undefined);
                    }
                }

                if (pendingSearchs.get(id) !== SearchStatus.Ongoing) { //user cancelled the search
                    clearInterval(interval);
                    pendingSearchs.delete(id);
                    resolve(undefined);
                }

                const ageChunk = collection.get(ageGroup);

                if (ageChunk) {
                    const pendingChunk = ageChunk.get(UserStatus.Pending);

                    if (pendingChunk) {
                        thisUser = pendingChunk.get(id)!;
                        for (const [userId, user] of pendingChunk.entries()) {
                            if (userId !== id) {
                                const commonInterests = findCommonInterests(interests, user.userData.interests);

                                if (!result || commonInterests.length > result.sharedInterests.length) {
                                    result = {
                                        thisUser: thisUser,
                                        userToPair: user,
                                        sharedInterests: commonInterests
                                    };
                                }
                            }
                        }
                    }
                }
            }, 50); // intervallo di ricerca in millisecondi
        });
    };

    const searchCancel = (id: string) => {
        if (pendingSearchs.has(id)) {
            pendingSearchs.set(id, SearchStatus.Stopped)
        }
    }

    return [addUser, getUser, removeUser, switchUserStatus, startSearch, searchCancel];
}

