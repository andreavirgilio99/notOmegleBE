"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchStopHandler = void 0;
const events_enum_1 = require("../events.enum");
function searchStopHandler(socket, searchCancel) {
    socket.on(events_enum_1.Events.SearchStop, () => {
        console.log(`some user stopped to look for a parner`);
        searchCancel(socket.id);
    });
}
exports.searchStopHandler = searchStopHandler;
