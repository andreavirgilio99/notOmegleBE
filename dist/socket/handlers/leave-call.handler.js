"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveCallHandler = void 0;
const events_enum_1 = require("../events.enum");
const types_1 = require("../../types");
function leaveCallHandler(socket, getUser, switchUserStatus) {
    socket.on(events_enum_1.Events.LeaveCall, (payload) => {
        const ageGroup = payload.isMinor ? types_1.AgeGroup.Minors : types_1.AgeGroup.Adults;
        const user = getUser(socket.id, payload.status, ageGroup);
        if (user && user.camPartner) {
            const partner = user.camPartner;
            switchUserStatus(socket.id, payload.status, ageGroup, types_1.UserStatus.Idle);
            switchUserStatus(partner.id, payload.status, ageGroup, types_1.UserStatus.Idle);
            partner.emit(`${partner.id}-${events_enum_1.Events.PartnerDisconnected}`);
        }
    });
}
exports.leaveCallHandler = leaveCallHandler;
