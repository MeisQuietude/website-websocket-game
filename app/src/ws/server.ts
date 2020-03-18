import { IncomingMessage } from "http";
import WebSocket from "ws";
import * as SocketRegister from "../lib/socket-register";


const wss: WebSocket.Server = new WebSocket.Server({ port: 3030 });

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  SocketRegister.set(ws, req.headers['sec-websocket-key'].toString());

  console.log(`User connected ${SocketRegister.get(ws)}`);

  ws.on("message", msg => {
    console.log(`Message ${msg} from user ${SocketRegister.get(ws)}`);
  })
  console.log([...wss.clients.values()].map(client => SocketRegister.get(client)));

})

console.log("WebSocket Server listen on port 3030!");
