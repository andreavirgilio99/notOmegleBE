"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketEventsConfig = void 0;
const user_collection_1 = require("../utils/user-collection");
const events_enum_1 = require("./events.enum");
const send_message_handler_1 = require("./handlers/send-message.handler");
const disconnection_handler_1 = require("./handlers/disconnection.handler");
const data_registration_handler_1 = require("./handlers/data-registration.handler");
const search_start_handler_1 = require("./handlers/search-start.handler");
const search_stop_handler_1 = require("./handlers/search-stop.handler");
const leave_call_handler_1 = require("./handlers/leave-call.handler");
function socketEventsConfig(io) {
    const [addUser, getUser, removeUser, switchUserStatus, startSearch, searchCancel] = (0, user_collection_1.getUserCollectionHandlers)();
    //socket.emit = send to only one, io.emit = send to everyone, socket.broadcaset.emit = send to everyone but that one connection
    io.on(events_enum_1.Events.Connection, (socket) => {
        console.log('user connected');
        socket.emit(events_enum_1.Events.Welcome, 'Successfuly connected to the WebSocket');
        (0, send_message_handler_1.sendMessageHandler)(socket, io);
        (0, disconnection_handler_1.userDisconnectedHandler)(socket, removeUser, switchUserStatus);
        (0, data_registration_handler_1.dataRegistrationHandler)(socket, addUser);
        (0, search_start_handler_1.searchStartHandler)(socket, switchUserStatus, startSearch);
        (0, search_stop_handler_1.searchStopHandler)(socket, searchCancel);
        (0, leave_call_handler_1.leaveCallHandler)(socket, getUser, switchUserStatus);
    });
}
exports.socketEventsConfig = socketEventsConfig;
