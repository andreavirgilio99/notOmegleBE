"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDisconnectedHandler = void 0;
const types_1 = require("../../types");
const events_enum_1 = require("../events.enum");
function userDisconnectedHandler(socket, removeUser, switchUserStatus, searchCancel) {
    socket.on(events_enum_1.Events.Disconnect, () => {
        console.log("user disconnected");
        searchCancel(socket.id);
        const result = removeUser(socket.id);
        socket.removeAllListeners();
        if (result.wasPaired) {
            const { camPartner, wasMinor } = result;
            if (camPartner) {
                const ageGroup = wasMinor ? types_1.AgeGroup.Minors : types_1.AgeGroup.Adults;
                switchUserStatus(camPartner.id, types_1.UserStatus.Paired, ageGroup, types_1.UserStatus.Idle);
                camPartner.emit(`${camPartner.id}-${events_enum_1.Events.PartnerDisconnected}`);
            }
            else {
                console.log("The disconnected user was paired, but his camPartner was undefined");
            }
        }
    });
}
exports.userDisconnectedHandler = userDisconnectedHandler;
