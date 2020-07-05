import { Socket } from "socket.io";

import indexEvents from "./events/indexEvents";
import gameEvents from "./events/gameEvents";

const applyEvents = (socket: Socket): void => {
    const serverIO = socket.server;

    socket.on("disconnecting", () => {
        for (const roomKey in socket.rooms) {
            socket.broadcast.to(roomKey).emit("game-leave-front", socket.id);
            socket.leave(roomKey);
        }
    });

    const index = new indexEvents(serverIO, socket);
    socket.on("chat", index.sendChatMessage);
    // socket.on("createGame", index.createGameInstance);

    const game = new gameEvents(serverIO, socket);
    // socket.on("game-prepare", game.prepare);
    socket.on("game-create", game.create);
    socket.on("game-join", game.join);
    socket.on("game-leave", game.leave);
    socket.on("game-turn", game.turn);
    socket.on("game-message", game.message);
};

export default applyEvents;
