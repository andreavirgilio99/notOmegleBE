"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchStartHandler = void 0;
const types_1 = require("../../types");
const events_enum_1 = require("../events.enum");
const remove_circular_references_1 = require("../../utils/remove-circular-references");
function searchStartHandler(socket, switchUserStatus, startSearch) {
    socket.on(events_enum_1.Events.SearchStart, (payload) => __awaiter(this, void 0, void 0, function* () {
        const userData = payload.data;
        const ageGroup = userData.isMinor ? types_1.AgeGroup.Minors : types_1.AgeGroup.Adults;
        try {
            switchUserStatus(socket.id, payload.status, ageGroup, types_1.UserStatus.Pending);
            console.log(`Some user switched to pending`);
            console.log(`Some user started to look for a partner`);
            const result = yield startSearch(socket.id, ageGroup, payload.data.interests);
            if (result) {
                handleSuccessfulPairing(socket, result);
            }
            else {
                switchUserStatus(socket.id, types_1.UserStatus.Pending, ageGroup, types_1.UserStatus.Idle);
            }
        }
        catch (error) {
            console.error(`Error starting search: ${error.message || error}`);
            switchUserStatus(socket.id, types_1.UserStatus.Pending, ageGroup, types_1.UserStatus.Idle);
        }
    }));
}
exports.searchStartHandler = searchStartHandler;
function handleSuccessfulPairing(socket, result) {
    const responsePayload = {
        camPartner: result.userToPair,
        sharedInterests: result.sharedInterests,
        youCall: socket.id > result.userToPair.socket.id
    };
    let sanitizedPayload = (0, remove_circular_references_1.removeCircularReferences)(responsePayload);
    socket.emit(`${socket.id}-${events_enum_1.Events.SuccessfulPairing}`, sanitizedPayload);
    responsePayload.camPartner = result.thisUser;
    responsePayload.youCall = !responsePayload.youCall;
    sanitizedPayload = (0, remove_circular_references_1.removeCircularReferences)(responsePayload);
    result.userToPair.socket.emit(`${result.userToPair.socket.id}-${events_enum_1.Events.SuccessfulPairing}`, sanitizedPayload);
}
