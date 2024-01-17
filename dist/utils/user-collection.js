"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersCollection = void 0;
const types_1 = require("../types");
function getUsersCollection() {
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
    const addUser = (id, user) => {
        var _a;
        const ageGroup = user.userData.isMinor ? types_1.AgeGroup.Minors : types_1.AgeGroup.Adults;
        const status = types_1.UserStatus.Idle;
        const collectionChunk = (_a = collection.get(ageGroup)) === null || _a === void 0 ? void 0 : _a.get(status);
        if (collectionChunk) {
            collectionChunk.set(id, user);
        }
    };
    const removeUser = (id) => {
        for (const [ageGroup, statusMap] of collection.entries()) {
            for (const [status, userMap] of statusMap.entries()) {
                if (userMap.has(id)) {
                    userMap.delete(id);
                    return;
                }
            }
        }
    };
    const switchUserStatus = (id, newStatus) => {
        var _a;
        for (const [ageGroup, statusMap] of collection.entries()) {
            for (const [status, userMap] of statusMap.entries()) {
                if (userMap.has(id)) {
                    const userData = userMap.get(id);
                    userMap.delete(id);
                    const newStatusMap = (_a = collection.get(ageGroup)) === null || _a === void 0 ? void 0 : _a.get(newStatus);
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
exports.getUsersCollection = getUsersCollection;
