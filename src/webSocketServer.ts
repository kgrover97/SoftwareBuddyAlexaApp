import http = require("http");
import AlexaUser from "./alexaUser";
import Log from "./log";

const WebSocket = require("ws");

export default class WebSocketServer {
    private port: number;
    private server: http.Server;
    private wss: any;

    constructor(port: number, server: http.Server) {
        this.port = port;
    }

    public getMessageHandler(user: AlexaUser) {
        return
    }


    /**
     * Starts the WebSocket server on the specified port.
     *
     * @returns A promise that resolves once the server has started.
     * @throws Failed to start WebSocket server. <reason>
     */
    public async start() {
        return new Promise((fulfill, reject) => {
            try {
                this.wss = new WebSocket.Server({
                    port: this.port,
                    server: this.server,
                    perMessageDeflate: false,
                    maxPayload: 1024
                }, () => {
                    Log.info(`WebSocketServer::start() - WebSocket server is listening on port ${this.port}.`);
                    fulfill();
                });

                this.wss.on("error", (err: Error) => {
                    Log.error(`WebSocketServer::onError() - WebSocket server failed to start. ${err}`);
                    return reject(err);
                });

                this.wss.on("connection", (ws: any) => {
                    // this isn't in the ts type file but see:
                    // https://github.com/websockets/ws/issues/982
                    let clientAddr = ws.upgradeReq.headers["x-forwarded-for"] || ws._socket.remoteAddress + ":" + ws._socket.remotePort;
                    let user = new AlexaUser(ws.upgradeReq.headers['user']);

                    Log.info(`WebSocketServer::onClientConnect() - New connection from ${clientAddr} by user ${user}.`);
                    // when a user closes the connection, remove them from list of users.
                    ws.on("close", () => {
                        Log.info(`WebSocketServer::onClientClose() - Connection to ${clientAddr} was closed by ${user}.`);
                    });
                });
            }
            catch (err) {
                throw new Error(`Failed to start WebSocket server. ${err}`);
            }
        });
    }


    /**
     * Stops the WebSocket server notifying all connected clients.
     *
     * @returns A promise that resolves once the server has closed.
     */
    public async stop() {
        return new Promise((fulfill) => {
            this.wss.close(() => fulfill());
        });
    }


    /**
     * Sends an object to a user/client.
     *
     * @param user The name of a connected user.
     * @param data An object to send to the user.
     *
     * @returns A promise that resolves to the response once it is received.
     * @throws Failed to send message to user '<user>'. <reason>
     */
    public async send(user: AlexaUser, data: object) {
        return new Promise((fulfill, reject) => {
            try {
                let client = this.getUserClient(user);

                client.send(JSON.stringify(data));
            }
            catch (err) {
                throw new Error(`Failed to send message to ${user}. ${err}`);
            }
        });
    }


    /**
     * Set the on message callback for a specific user.
     *
     * @param user The user to add the callback for.
     * @param callback The function to call when a message is received from the
     * specific user.
     * @throws
     */
    public setMessageHandler(user: AlexaUser, callback: MessageEvent) {
        let client = this.getUserClient(user);

        client.onmessage(callback);
    }

    /**
     * Returns a promise that resolves to true when the client for the user is ready.
     *
     * @param user The user to check if ready.
     * @returns A promise that resolves to true once the client is connection is
     * open, or false otherwise (client is disconnecting or disconnected).
     */
    public async isClientReady(user: AlexaUser): Promise<boolean> {
        return new Promise<boolean>((fulfill, reject) => {
            try {
                let client = this.getUserClient(user);

                switch (client.readyState) {
                    case WebSocket.OPEN:
                        fulfill(true);
                        break;
                    case WebSocket.CONNECTING:
                        // client.onopen();
                        fulfill(true)
                        break;
                    default:
                        fulfill(false);
                }
            }
            catch (err) {
                fulfill(false);
            }
        });
    }

    /**
     * Gets the WebSocket client for the user.
     *
     * @param user The user to return the client for.
     * @returns THe WebSocket client or undefined if the user has no client.
     */
    private getUserClient(user: AlexaUser): WebSocket {
        let userClient: WebSocket;

        if (typeof user === undefined)
            throw new Error("No user specified.");

        this.wss.clients.forEach((client: any) => {
            if (client.upgradeReq.headers["user"] === user.raw)
                userClient = client;
        });

        if (typeof userClient !== "undefined")
            return userClient;
        else
            throw new Error("The specified user has no client.");
    }
}
