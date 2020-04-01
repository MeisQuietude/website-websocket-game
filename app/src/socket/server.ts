import io from "socket.io";

const serverIO = io({
    serveClient: false,
});

serverIO.on("connection", (socket: io.Socket) => {
    console.log(`Connection ${socket.id}`);
})

export default serverIO;
