"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const events_config_1 = require("./socket/events-config");
const app_config_1 = require("./utils/app-config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ['http://localhost:4200'],
    },
});
(0, app_config_1.appConfig)(app);
(0, events_config_1.socketEventsConfig)(io);
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
