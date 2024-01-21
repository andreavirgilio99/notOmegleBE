import { Socket } from 'socket.io';
import { AgeGroup, GetUsersCollectionResult, RemoveUserResult, SearchStartResult, SearchStatus, User, UserStatus, UsersCollection } from '../types';
import { findCommonInterests } from './find-common-interests';

export function getUsersCollection(): GetUsersCollectionResult {
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
            camPartner: undefined
        }

        for (const [ageGroup, statusMap] of collection.entries()) {
            for (const [status, userMap] of statusMap.entries()) {
                if (userMap.has(id)) {
                    if (status == UserStatus.Paired) {
                        result.wasPaired = true;
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
                    newStatusChunk.set(id, user)
                }
                else {
                    console.log("User not found during status switch");
                }
            }
        }
    };

    const startSearch = async (id: string, ageGroup: AgeGroup, interests: string[]): Promise<SearchStartResult | undefined> => {
        return new Promise<SearchStartResult | undefined>((resolve) => {
            let result: SearchStartResult | undefined = undefined;
            pendingSearchs.set(id, SearchStatus.Ongoing);
            let thisUser: User | undefined = undefined;
            const interval = setInterval(() => console.log(collection), 3000)

            while (!result) {
                if (pendingSearchs.get(id) === SearchStatus.Ongoing) {
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
                    } else { //user cancelled the search
                        pendingSearchs.delete(id);
                        clearInterval(interval)
                        resolve(undefined);
                    }
                }
            }

            thisUser!.camPartner = result.userToPair.socket;
            result.userToPair.camPartner = thisUser!.socket;
            switchUserStatus(result.userToPair.socket.id, UserStatus.Pending, ageGroup, UserStatus.Paired);

            pendingSearchs.delete(id);
            clearInterval(interval)
            resolve(result);
        })

    }

    const searchCancel = (id: string) => {
        if (pendingSearchs.has(id)) {
            pendingSearchs.set(id, SearchStatus.Stopped)
        }
    }

    return [addUser, removeUser, switchUserStatus, startSearch, searchCancel];
}

