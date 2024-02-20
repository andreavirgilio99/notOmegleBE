import { Socket } from "socket.io";
import { AgeGroup, RemoveUserFunction, SwitchUserStatusFunction, UserStatus } from "../../types";
import { Events } from "../events.enum";

export function userDisconnectedHandler(socket: Socket, removeUser: RemoveUserFunction, switchUserStatus: SwitchUserStatusFunction) {
    socket.on(Events.Disconnect, () => {
        console.log("user disconnected");
        const result = removeUser(socket.id);
        socket.removeAllListeners();

        if (result.wasPaired) {
            const { camPartner, wasMinor } = result
            if (camPartner) {
                const ageGroup = wasMinor ? AgeGroup.Minors : AgeGroup.Adults
                switchUserStatus(camPartner.id, UserStatus.Paired, ageGroup, UserStatus.Idle);
                camPartner.emit(`${camPartner.id}-${Events.PartnerDisconnected}`)
            }
            else {
                console.log("The disconnected user was paired, but his camPartner was undefined");
            }
        }
    })
}