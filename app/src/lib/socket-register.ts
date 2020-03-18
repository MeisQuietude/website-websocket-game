import WebSocket from "ws";

const _socketRegister = new WeakMap<WebSocket, string>();

export const set = (ws: WebSocket, secWsKey: string) => {
    _socketRegister.set(ws, secWsKey);
};

export const get = (ws: WebSocket) => _socketRegister.get(ws)
export const remove = (ws: WebSocket) => _socketRegister.delete(ws)
export const has = (ws: WebSocket) => _socketRegister.has(ws);
