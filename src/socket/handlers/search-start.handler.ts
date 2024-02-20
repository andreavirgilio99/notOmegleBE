import { Socket } from "socket.io";
import { AgeGroup, UserStatus, SearchStartResult, SwitchUserStatusFunction, SearchStartFunction } from "../../types";
import { Events } from "../events.enum";
import { SearchStartPayload, SuccessfulPairingPayload } from "../socket.types";

export function searchStartHandler(socket: Socket, switchUserStatus: SwitchUserStatusFunction, startSearch: SearchStartFunction) {
    socket.on(Events.SearchStart, (payload: SearchStartPayload) => {
        const userData = payload.data;
        const ageGroup = userData.isMinor ? AgeGroup.Minors : AgeGroup.Adults;
        switchUserStatus(socket.id, payload.status, ageGroup, UserStatus.Pending);
        console.log(`some user switched to  pending`)
        console.log(`some user started to look for a parner`)

        const callback = (result: SearchStartResult | undefined) => {
            if (result) {
                const responsePayload: SuccessfulPairingPayload = {
                    camPartner: result.userToPair,
                    sharedInterests: result.sharedInterests,
                    youCall: socket.id > result.userToPair.socket!.id
                }
                switchUserStatus(socket.id, UserStatus.Pending, ageGroup, UserStatus.Paired);

                //can't send those props coz they be having a circular structure
                let socketProp = responsePayload.camPartner.socket;
                let camPartnerProp = responsePayload.camPartner.camPartner;
                responsePayload.camPartner.socket = undefined;
                responsePayload.camPartner.camPartner = undefined;


                socket.emit(`${socket.id}-${Events.SuccessfulPairing}`, responsePayload)

                //setting them back
                responsePayload.camPartner.socket = socketProp;
                responsePayload.camPartner.camPartner = camPartnerProp;

                responsePayload.camPartner = result.thisUser;
                responsePayload.youCall = !responsePayload.youCall

                //can't send those props coz they be having a circular structure
                socketProp = responsePayload.camPartner.socket;
                camPartnerProp = responsePayload.camPartner.camPartner;
                responsePayload.camPartner.socket = undefined;
                responsePayload.camPartner.camPartner = undefined;

                socket.emit(`${result.userToPair.socket!.id}-${Events.SuccessfulPairing}`, responsePayload)

                //setting them back
                responsePayload.camPartner.socket = socketProp;
                responsePayload.camPartner.camPartner = camPartnerProp;
            }
            else {
                switchUserStatus(socket.id, UserStatus.Pending, ageGroup, UserStatus.Idle);
            }
        }

        startSearch(socket.id, ageGroup, payload.data.interests).then(callback)
    })
}