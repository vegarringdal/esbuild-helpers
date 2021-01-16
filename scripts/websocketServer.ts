/**
 * Creates web socket server
 */

import WebSocket from "ws";
import { log } from "./log";

let webSocketServerInstance = null;
const connections = new Set();


/**
 * Start server
 * @param port 
 */
export function startWebsocketServer(port: number) {
  webSocketServerInstance = new WebSocket.Server({ port });

  webSocketServerInstance.on("connection", function connection(wsConnection) {
    log("client connected");
    connections.add(wsConnection);
  });

  webSocketServerInstance.on("close", function close(wsConnection:any) {
    log("client disconnected");
    connections.delete(wsConnection);
  });
}

export function callWebsocketClient(msg: string) {
  Array.from(connections).forEach((wsConnection: any) =>{
    wsConnection.send(msg);
  });
}
