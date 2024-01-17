import { Socket, Server as SocketIOServer } from 'socket.io';
import { getUsersCollection } from '../utils/user-collection';
import { Events } from './events.enum';
import { DataRegistrationPayload } from './socket.types';

export function socketEventsConfig(io: SocketIOServer) {

    const [addUser, removeUser, switchUserStatus] = getUsersCollection()

    io.on(Events.Connection, (socket: Socket) => {
        console.log('user connected')
        socket.emit(Events.Welcome, 'Successfuly connected to the WebSocket')

        socket.on(Events.Disconnect, () => {
            console.log("user disconnected")
            removeUser(socket.id)
            socket.removeAllListeners();
        })

        socket.on(Events.DataRegistration, (payload: DataRegistrationPayload) => {
            addUser(socket.id, payload.data)
        })
    })
}