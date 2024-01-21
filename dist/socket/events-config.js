"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketEventsConfig = void 0;
const user_collection_1 = require("../utils/user-collection");
const events_enum_1 = require("./events.enum");
const types_1 = require("../types");
function socketEventsConfig(io) {
    const [addUser, removeUser, switchUserStatus, startSearch, searchCancel] = (0, user_collection_1.getUsersCollection)();
    let user;
    //socket.emit = send to only one, io.emit = send to everyone, socket.broadcaset.emit = send to everyone but that one connection
    io.on(events_enum_1.Events.Connection, (socket) => {
        console.log('user connected');
        socket.emit(events_enum_1.Events.Welcome, 'Successfuly connected to the WebSocket');
        socket.on(events_enum_1.Events.Disconnect, () => {
            console.log("user disconnected");
            const result = removeUser(socket.id);
            socket.removeAllListeners();
            if (result.wasPaired) {
                const { camPartner } = result;
                if (camPartner) {
                    camPartner.emit(`${camPartner.id}-${events_enum_1.Events.PartnerDisconnected}`);
                }
                else {
                    console.log("The disconnected user was paired, but his camPartner was undefined");
                }
            }
        });
        socket.on(events_enum_1.Events.DataRegistration, (payload) => {
            addUser(socket, payload.data);
            user = payload.data.userData;
            console.log("User registered");
        });
        socket.on(events_enum_1.Events.SearchStart, (payload) => {
            const userData = payload.data;
            const ageGroup = userData.isMinor ? types_1.AgeGroup.Minors : types_1.AgeGroup.Adults;
            switchUserStatus(socket.id, payload.status, ageGroup, types_1.UserStatus.Pending);
            console.log(`${user === null || user === void 0 ? void 0 : user.username} switched to  pending`);
            console.log(`${user === null || user === void 0 ? void 0 : user.username} started to look for a parner`);
            const callback = (result) => {
                if (result) {
                    const responsePayload = {
                        camPartner: result.userToPair,
                        sharedInterests: result.sharedInterests,
                        youCall: socket.id > result.userToPair.socket.id
                    };
                    switchUserStatus(socket.id, types_1.UserStatus.Pending, ageGroup, types_1.UserStatus.Paired);
                    socket.emit(`${socket.id}-${events_enum_1.Events.SuccessfulPairing}`, responsePayload);
                    responsePayload.camPartner = result.thisUser;
                    socket.emit(`${result.userToPair.socket.id}-${events_enum_1.Events.SuccessfulPairing}`, responsePayload);
                }
                else {
                    switchUserStatus(socket.id, types_1.UserStatus.Pending, ageGroup, types_1.UserStatus.Idle);
                }
            };
            startSearch(socket.id, ageGroup, payload.data.interests).then(callback);
        });
        socket.on(events_enum_1.Events.SearchStop, () => {
            console.log(`${user === null || user === void 0 ? void 0 : user.username} stopped to look for a parner`);
            searchCancel(socket.id);
        });
    });
}
exports.socketEventsConfig = socketEventsConfig;
