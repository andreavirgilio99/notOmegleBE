"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageHandler = void 0;
const events_enum_1 = require("../events.enum");
function sendMessageHandler(socket, io) {
    socket.on(events_enum_1.Events.SendMessage, (payload) => {
        io.emit(`${payload.data.to}-${events_enum_1.Events.MessageReceived}`, payload);
        io.emit(`${payload.data.sender}-${events_enum_1.Events.MessageReceived}`, payload);
    });
}
exports.sendMessageHandler = sendMessageHandler;
