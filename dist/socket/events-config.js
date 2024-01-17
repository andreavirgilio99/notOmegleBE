"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketEventsConfig = void 0;
const user_collection_1 = require("../utils/user-collection");
const events_enum_1 = require("./events.enum");
function socketEventsConfig(io) {
    const [addUser, removeUser, switchUserStatus] = (0, user_collection_1.getUsersCollection)();
    io.on(events_enum_1.Events.Connection, (socket) => {
        console.log('user connected');
        socket.emit(events_enum_1.Events.Welcome, 'Successfuly connected to the WebSocket');
        socket.on(events_enum_1.Events.Disconnect, () => {
            console.log("user disconnected");
            removeUser(socket.id);
            socket.removeAllListeners();
        });
        socket.on(events_enum_1.Events.DataRegistration, (payload) => {
            addUser(socket.id, payload.data);
        });
    });
}
exports.socketEventsConfig = socketEventsConfig;
