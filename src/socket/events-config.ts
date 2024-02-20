import { Socket, Server as SocketIOServer } from 'socket.io';
import { getUserCollectionHandlers } from '../utils/user-collection';
import { Events } from './events.enum';
import { sendMessageHandler } from './handlers/send-message.handler';
import { userDisconnectedHandler } from './handlers/disconnection.handler';
import { dataRegistrationHandler } from './handlers/data-registration.handler';
import { searchStartHandler } from './handlers/search-start.handler';
import { searchStopHandler } from './handlers/search-stop.handler';
import { leaveCallHandler } from './handlers/leave-call.handler';

export function socketEventsConfig(io: SocketIOServer) {

    const [
        addUser,
        getUser,
        removeUser,
        switchUserStatus,
        startSearch,
        searchCancel
    ] = getUserCollectionHandlers()

    //socket.emit = send to only one, io.emit = send to everyone, socket.broadcaset.emit = send to everyone but that one connection
    io.on(Events.Connection, (socket: Socket) => {
        console.log('user connected')
        socket.emit(Events.Welcome, 'Successfuly connected to the WebSocket')

        sendMessageHandler(socket, io);
        userDisconnectedHandler(socket, removeUser, switchUserStatus);
        dataRegistrationHandler(socket, addUser);
        searchStartHandler(socket, switchUserStatus, startSearch);
        searchStopHandler(socket, searchCancel);
        leaveCallHandler(socket, getUser, switchUserStatus);
    })
}