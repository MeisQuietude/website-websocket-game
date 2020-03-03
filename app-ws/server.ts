import * as WebSocket from 'ws';

const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ port: 40510 });

wss.on("connection", function(ws: WebSocket) {
  ws.on("message", function(message: string) {
    console.log("received: %s", message);
  });

  setInterval(() => ws.send(`${new Date()}`), 1000);
});
