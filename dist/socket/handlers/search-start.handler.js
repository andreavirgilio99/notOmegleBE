"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchStartHandler = void 0;
const types_1 = require("../../types");
const events_enum_1 = require("../events.enum");
function searchStartHandler(socket, switchUserStatus, startSearch) {
    socket.on(events_enum_1.Events.SearchStart, (payload) => {
        const userData = payload.data;
        const ageGroup = userData.isMinor ? types_1.AgeGroup.Minors : types_1.AgeGroup.Adults;
        switchUserStatus(socket.id, payload.status, ageGroup, types_1.UserStatus.Pending);
        console.log(`some user switched to  pending`);
        console.log(`some user started to look for a parner`);
        const callback = (result) => {
            if (result) {
                const responsePayload = {
                    camPartner: result.userToPair,
                    sharedInterests: result.sharedInterests,
                    youCall: socket.id > result.userToPair.socket.id
                };
                switchUserStatus(socket.id, types_1.UserStatus.Pending, ageGroup, types_1.UserStatus.Paired);
                //can't send those props coz they be having a circular structure
                let socketProp = responsePayload.camPartner.socket;
                let camPartnerProp = responsePayload.camPartner.camPartner;
                responsePayload.camPartner.socket = undefined;
                responsePayload.camPartner.camPartner = undefined;
                socket.emit(`${socket.id}-${events_enum_1.Events.SuccessfulPairing}`, responsePayload);
                //setting them back
                responsePayload.camPartner.socket = socketProp;
                responsePayload.camPartner.camPartner = camPartnerProp;
                responsePayload.camPartner = result.thisUser;
                responsePayload.youCall = !responsePayload.youCall;
                //can't send those props coz they be having a circular structure
                socketProp = responsePayload.camPartner.socket;
                camPartnerProp = responsePayload.camPartner.camPartner;
                responsePayload.camPartner.socket = undefined;
                responsePayload.camPartner.camPartner = undefined;
                socket.emit(`${result.userToPair.socket.id}-${events_enum_1.Events.SuccessfulPairing}`, responsePayload);
                //setting them back
                responsePayload.camPartner.socket = socketProp;
                responsePayload.camPartner.camPartner = camPartnerProp;
            }
            else {
                switchUserStatus(socket.id, types_1.UserStatus.Pending, ageGroup, types_1.UserStatus.Idle);
            }
        };
        startSearch(socket.id, ageGroup, payload.data.interests).then(callback);
    });
}
exports.searchStartHandler = searchStartHandler;
