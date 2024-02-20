import { Socket } from "socket.io";
import { Events } from "../events.enum";
import { SearchCancelFunction } from "../../types";

export function searchStopHandler(socket: Socket, searchCancel: SearchCancelFunction) {
    socket.on(Events.SearchStop, () => {
        console.log(`some user stopped to look for a parner`)
        searchCancel(socket.id);
    })
}