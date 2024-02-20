import { Socket } from "socket.io";
import { Events } from "../events.enum";
import { LeaveCallPayload } from "../socket.types";
import { AgeGroup, GetUserFunction, SwitchUserStatusFunction, UserStatus } from "../../types";

export function leaveCallHandler(socket: Socket, getUser: GetUserFunction, switchUserStatus: SwitchUserStatusFunction) {
    socket.on(Events.LeaveCall, (payload: LeaveCallPayload) => {
        const ageGroup = payload.isMinor ? AgeGroup.Minors : AgeGroup.Adults
        const user = getUser(socket.id, payload.status, ageGroup)

        if (user && user.camPartner) {
            const partner = user.camPartner
            switchUserStatus(socket.id, payload.status, ageGroup, UserStatus.Idle)
            switchUserStatus(partner.id, payload.status, ageGroup, UserStatus.Idle)
            partner.emit(`${partner.id}-${Events.PartnerDisconnected}`)
        }
    })
}