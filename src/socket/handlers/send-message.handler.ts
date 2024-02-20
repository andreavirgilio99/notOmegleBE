import { Socket, Server as SocketIOServer } from "socket.io"
import { Events } from "../events.enum"
import { MessageEventPayload } from "../socket.types"

export function sendMessageHandler(socket: Socket, io: SocketIOServer) {
    socket.on(Events.SendMessage, (payload: MessageEventPayload) => {
        io.emit(`${payload.data.to}-${Events.MessageReceived}`, payload)
        io.emit(`${payload.data.sender}-${Events.MessageReceived}`, payload)
    })
}