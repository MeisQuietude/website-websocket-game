import { Server, Socket } from "socket.io";

class EventConstructor {
    protected serverIO: Server;
    protected socket: Socket;

    constructor(serverIO: Server, socket: Socket) {
        this.serverIO = serverIO;
        this.socket = socket;
    }
}

export default EventConstructor;
