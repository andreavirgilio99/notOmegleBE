"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataRegistrationHandler = void 0;
const events_enum_1 = require("../events.enum");
function dataRegistrationHandler(socket, addUser) {
    socket.on(events_enum_1.Events.DataRegistration, (payload) => {
        addUser(socket, payload.data);
        console.log("User registered");
    });
}
exports.dataRegistrationHandler = dataRegistrationHandler;
