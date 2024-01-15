import { Socket, Server as SocketIOServer } from 'socket.io';
import { getUsersCollection } from './utils';
import { UserData } from './types';

export function socketEventsConfiguration(io: SocketIOServer) {

    const [addUser, removeUser, switchUserStatus] = getUsersCollection();

    io.on('connection', (socket: Socket) => {
        console.log('user connected')
        socket.emit('welcome', 'Successfuly connected to the WebSocket')

        socket.on('disconnect', () => {
            console.log("user disconnected")
            removeUser(socket.id)
            socket.removeAllListeners();
        })
        //i'll have to add the fucking peerId
        socket.on('data-registration', (data: UserData) => {
            addUser(socket.id, data)
        })
    })
}