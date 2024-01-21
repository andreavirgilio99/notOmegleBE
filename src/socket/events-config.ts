import { Socket, Server as SocketIOServer } from 'socket.io';
import { getUsersCollection } from '../utils/user-collection';
import { Events } from './events.enum';
import { DataRegistrationPayload, SearchStartPayload, SuccessfulPairingPayload } from './socket.types';
import { AgeGroup, SearchStartResult, UserData, UserStatus } from '../types';

export function socketEventsConfig(io: SocketIOServer) {

    const [
        addUser,
        removeUser,
        switchUserStatus,
        startSearch,
        searchCancel
    ] = getUsersCollection()

    let user: UserData | undefined

    //socket.emit = send to only one, io.emit = send to everyone, socket.broadcaset.emit = send to everyone but that one connection
    io.on(Events.Connection, (socket: Socket) => {
        console.log('user connected')
        socket.emit(Events.Welcome, 'Successfuly connected to the WebSocket')

        socket.on(Events.Disconnect, () => {
            console.log("user disconnected");
            const result = removeUser(socket.id);
            socket.removeAllListeners();

            if (result.wasPaired) {
                const { camPartner } = result
                if (camPartner) {
                    camPartner.emit(`${camPartner.id}-${Events.PartnerDisconnected}`)
                }
                else {
                    console.log("The disconnected user was paired, but his camPartner was undefined");
                }
            }
        })

        socket.on(Events.DataRegistration, (payload: DataRegistrationPayload) => {
            addUser(socket, payload.data);
            user = payload.data.userData;
            console.log("User registered")
        })

        socket.on(Events.SearchStart, (payload: SearchStartPayload) => {
            const userData = payload.data;
            const ageGroup = userData.isMinor ? AgeGroup.Minors : AgeGroup.Adults;
            switchUserStatus(socket.id, payload.status, ageGroup, UserStatus.Pending);
            console.log(`${user?.username} switched to  pending`)
            console.log(`${user?.username} started to look for a parner`)

            const callback = (result: SearchStartResult | undefined) => {
                if (result) {
                    const responsePayload: SuccessfulPairingPayload = {
                        camPartner: result.userToPair,
                        sharedInterests: result.sharedInterests,
                        youCall: socket.id > result.userToPair.socket.id
                    }

                    switchUserStatus(socket.id, UserStatus.Pending, ageGroup, UserStatus.Paired);
                    socket.emit(`${socket.id}-${Events.SuccessfulPairing}`, responsePayload)
                    responsePayload.camPartner = result.thisUser;
                    socket.emit(`${result.userToPair.socket.id}-${Events.SuccessfulPairing}`, responsePayload)
                }
                else {
                    switchUserStatus(socket.id, UserStatus.Pending, ageGroup, UserStatus.Idle);
                }
            }

            startSearch(socket.id, ageGroup, payload.data.interests).then(callback)
        })

        socket.on(Events.SearchStop, () => {
            console.log(`${user?.username} stopped to look for a parner`)
            searchCancel(socket.id);
        })
    })
}