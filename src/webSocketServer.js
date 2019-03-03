"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const alexaUser_1 = require("./alexaUser");
const log_1 = require("./log");
const WebSocket = require("ws");
class WebSocketServer {
    constructor(port, server) {
        this.port = port;
    }
    getMessageHandler(user) {
        return;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((fulfill, reject) => {
                try {
                    this.wss = new WebSocket.Server({
                        port: this.port,
                        server: this.server,
                        perMessageDeflate: false,
                        maxPayload: 1024
                    }, () => {
                        log_1.default.info(`WebSocketServer::start() - WebSocket server is listening on port ${this.port}.`);
                        fulfill();
                    });
                    this.wss.on("error", (err) => {
                        log_1.default.error(`WebSocketServer::onError() - WebSocket server failed to start. ${err}`);
                        return reject(err);
                    });
                    this.wss.on("connection", (ws) => {
                        let clientAddr = ws.upgradeReq.headers["x-forwarded-for"] || ws._socket.remoteAddress + ":" + ws._socket.remotePort;
                        let user = new alexaUser_1.default(ws.upgradeReq.headers['user']);
                        log_1.default.info(`WebSocketServer::onClientConnect() - New connection from ${clientAddr} by user ${user}.`);
                        ws.on("close", () => {
                            log_1.default.info(`WebSocketServer::onClientClose() - Connection to ${clientAddr} was closed by ${user}.`);
                        });
                    });
                }
                catch (err) {
                    throw new Error(`Failed to start WebSocket server. ${err}`);
                }
            });
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((fulfill) => {
                this.wss.close(() => fulfill());
            });
        });
    }
    send(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((fulfill, reject) => {
                try {
                    let client = this.getUserClient(user);
                    client.send(JSON.stringify(data));
                }
                catch (err) {
                    throw new Error(`Failed to send message to ${user}. ${err}`);
                }
            });
        });
    }
    setMessageHandler(user, callback) {
        let client = this.getUserClient(user);
        client.onmessage(callback);
    }
    isClientReady(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((fulfill, reject) => {
                try {
                    let client = this.getUserClient(user);
                    switch (client.readyState) {
                        case WebSocket.OPEN:
                            fulfill(true);
                            break;
                        case WebSocket.CONNECTING:
                            fulfill(true);
                            break;
                        default:
                            fulfill(false);
                    }
                }
                catch (err) {
                    fulfill(false);
                }
            });
        });
    }
    getUserClient(user) {
        let userClient;
        if (typeof user === undefined)
            throw new Error("No user specified.");
        this.wss.clients.forEach((client) => {
            if (client.upgradeReq.headers["user"] === user.raw)
                userClient = client;
        });
        if (typeof userClient !== "undefined")
            return userClient;
        else
            throw new Error("The specified user has no client.");
    }
}
exports.default = WebSocketServer;
//# sourceMappingURL=webSocketServer.js.map