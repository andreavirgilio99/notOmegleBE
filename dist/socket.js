"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketEventsConfiguration = void 0;
const utils_1 = require("./utils");
function socketEventsConfiguration(io) {
    const [addUser, removeUser, switchUserStatus] = (0, utils_1.getUsersCollection)();
    io.on('connection', (socket) => {
        console.log('user connected');
        socket.emit('welcome', 'Successfuly connected to the WebSocket');
        socket.on('disconnect', () => {
            console.log("user disconnected");
            removeUser(socket.id);
            socket.removeAllListeners();
        });
        //i'll have to add the fucking peerId
        socket.on('data-registration', (data) => {
            addUser(socket.id, data);
        });
    });
}
exports.socketEventsConfiguration = socketEventsConfiguration;
