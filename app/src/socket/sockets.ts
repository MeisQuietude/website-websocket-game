import * as WebSocket from "ws";

const game = new WebSocket.Server({ noServer: true });
const chat = new WebSocket.Server({ noServer: true });

game.on("connection", (ws: WebSocket) => {
    console.log("Connected to game!");

    ws.on("message", (msg) => {
        console.log(msg);
    });
});

chat.on("connection", (ws: WebSocket) => {
    console.log("Connected to chat!");
});

export { game, chat };
