"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersCollection = void 0;
const types_1 = require("../types");
const find_common_interests_1 = require("./find-common-interests");
function getUsersCollection() {
    const pendingSearchs = new Map();
    const collection = new Map([
        [types_1.AgeGroup.Adults, new Map([
                [types_1.UserStatus.Idle, new Map()],
                [types_1.UserStatus.Paired, new Map()],
                [types_1.UserStatus.Pending, new Map()],
            ])],
        [types_1.AgeGroup.Minors, new Map([
                [types_1.UserStatus.Idle, new Map()],
                [types_1.UserStatus.Paired, new Map()],
                [types_1.UserStatus.Pending, new Map()],
            ])],
    ]);
    const addUser = (client, user) => {
        var _a;
        user.socket = client;
        const ageGroup = user.userData.isMinor ? types_1.AgeGroup.Minors : types_1.AgeGroup.Adults;
        const status = types_1.UserStatus.Idle;
        const collectionChunk = (_a = collection.get(ageGroup)) === null || _a === void 0 ? void 0 : _a.get(status);
        if (collectionChunk) {
            collectionChunk.set(client.id, user);
        }
    };
    //can't be optimized coz can't send data payload during disconnection
    const removeUser = (id) => {
        const result = {
            wasPaired: false,
            camPartner: undefined
        };
        for (const [ageGroup, statusMap] of collection.entries()) {
            for (const [status, userMap] of statusMap.entries()) {
                if (userMap.has(id)) {
                    if (status == types_1.UserStatus.Paired) {
                        result.wasPaired = true;
                        result.camPartner = userMap.get(id).camPartner;
                    }
                    userMap.delete(id);
                    return result;
                }
            }
        }
        console.log("user not found during user removal");
        return result; //should be unreachable
    };
    const switchUserStatus = (id, oldStatus, ageGroup, newStatus) => {
        const ageGroupChunk = collection.get(ageGroup);
        if (ageGroupChunk) {
            const oldStatusChunk = ageGroupChunk.get(oldStatus);
            if (oldStatusChunk) {
                const user = oldStatusChunk.get(id);
                oldStatusChunk.delete(id);
                const newStatusChunk = ageGroupChunk.get(newStatus);
                if (newStatusChunk && user) {
                    newStatusChunk.set(id, user);
                }
                else {
                    console.log("User not found during status switch");
                }
            }
        }
    };
    const startSearch = (id, ageGroup, interests) => __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            let result = undefined;
            pendingSearchs.set(id, types_1.SearchStatus.Ongoing);
            let thisUser = undefined;
            const interval = setInterval(() => console.log(collection), 3000);
            while (!result) {
                if (pendingSearchs.get(id) === types_1.SearchStatus.Ongoing) {
                    const ageChunk = collection.get(ageGroup);
                    if (ageChunk) {
                        const pendingChunk = ageChunk.get(types_1.UserStatus.Pending);
                        if (pendingChunk) {
                            thisUser = pendingChunk.get(id);
                            for (const [userId, user] of pendingChunk.entries()) {
                                if (userId !== id) {
                                    const commonInterests = (0, find_common_interests_1.findCommonInterests)(interests, user.userData.interests);
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
                    else { //user cancelled the search
                        pendingSearchs.delete(id);
                        clearInterval(interval);
                        resolve(undefined);
                    }
                }
            }
            thisUser.camPartner = result.userToPair.socket;
            result.userToPair.camPartner = thisUser.socket;
            switchUserStatus(result.userToPair.socket.id, types_1.UserStatus.Pending, ageGroup, types_1.UserStatus.Paired);
            pendingSearchs.delete(id);
            clearInterval(interval);
            resolve(result);
        });
    });
    const searchCancel = (id) => {
        if (pendingSearchs.has(id)) {
            pendingSearchs.set(id, types_1.SearchStatus.Stopped);
        }
    };
    return [addUser, removeUser, switchUserStatus, startSearch, searchCancel];
}
exports.getUsersCollection = getUsersCollection;
