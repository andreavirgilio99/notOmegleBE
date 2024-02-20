import { Socket } from "socket.io";
import { Events } from "../events.enum";
import { DataRegistrationPayload } from "../socket.types";
import { AddUserFunction } from "../../types";

export function dataRegistrationHandler(socket: Socket, addUser: AddUserFunction) {
    socket.on(Events.DataRegistration, (payload: DataRegistrationPayload) => {
        addUser(socket, payload.data);
        console.log("User registered")
    })
}