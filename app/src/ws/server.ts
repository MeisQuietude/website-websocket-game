import { Socket } from "net";

import * as http from "http";
import url from "url";

import { game, chat } from "./sockets";

const server: http.Server = http.createServer();

server.on("upgrade", (request: http.IncomingMessage, socket: Socket, upgradeHead: Buffer) => {
  const pathname = url.parse(request.url).pathname;

  switch (pathname) {
    case "/game":
      game.handleUpgrade(request, socket, upgradeHead, (ws) => {
        game.emit("connection", ws, request);
      });
      break;
    case "/chat":
      chat.handleUpgrade(request, socket, upgradeHead, (ws) => {
        chat.emit("connection", ws, request);
      });
      break;
    default:
      socket.destroy();
      break;
  }
})

server.listen(3030, () => {
  console.log("WebSocket Server listen on port 3030!")
});
