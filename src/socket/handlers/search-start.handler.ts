import { Socket } from "socket.io";
import { AgeGroup, UserStatus, SearchStartResult, SwitchUserStatusFunction, SearchStartFunction } from "../../types";
import { Events } from "../events.enum";
import { SearchStartPayload, SuccessfulPairingPayload } from "../socket.types";
import { removeCircularReferences } from "../../utils/remove-circular-references";

export function searchStartHandler(socket: Socket, switchUserStatus: SwitchUserStatusFunction, startSearch: SearchStartFunction) {
    socket.on(Events.SearchStart, async (payload: SearchStartPayload) => {
        const userData = payload.data;
        const ageGroup = userData.isMinor ? AgeGroup.Minors : AgeGroup.Adults;

        try {
            switchUserStatus(socket.id, payload.status, ageGroup, UserStatus.Pending);
            console.log(`Some user switched to pending`);
            console.log(`Some user started to look for a partner`);

            const result = await startSearch(socket.id, ageGroup, payload.data.interests);

            if (result) {
                handleSuccessfulPairing(socket, result);
            } else {
                switchUserStatus(socket.id, UserStatus.Pending, ageGroup, UserStatus.Idle);
            }
        } catch (error: any) {
            console.error(`Error starting search: ${error.message || error}`);
            switchUserStatus(socket.id, UserStatus.Pending, ageGroup, UserStatus.Idle);
        }
    });
}

function handleSuccessfulPairing(socket: Socket, result: SearchStartResult) {
    const responsePayload: SuccessfulPairingPayload = {
        camPartner: result.userToPair,
        sharedInterests: result.sharedInterests,
        youCall: socket.id > result.userToPair.socket!.id
    };

    let sanitizedPayload = removeCircularReferences(responsePayload);

    socket.emit(`${socket.id}-${Events.SuccessfulPairing}`, sanitizedPayload);

    responsePayload.camPartner = result.thisUser;
    responsePayload.youCall = !responsePayload.youCall;

    sanitizedPayload = removeCircularReferences(responsePayload);

    result.userToPair.socket!.emit(`${result.userToPair.socket!.id}-${Events.SuccessfulPairing}`, sanitizedPayload);
}