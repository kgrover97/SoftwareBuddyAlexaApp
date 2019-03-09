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
const restServer_1 = require("./restServer");
const webSocketServer_1 = require("./webSocketServer");
const log_1 = require("./log");
const alexaUser_1 = require("./alexaUser");
const timer_1 = require("./timer");
class Proxy {
    constructor(restPort, wssPort) {
        try {
            this._restServer = new restServer_1.default(restPort);
            this._wss = new webSocketServer_1.default(wssPort, this._restServer.server);
        }
        catch (err) {
            throw new Error(`Failed to initialize servers. ${err}`);
        }
    }
    get restServer() {
        return this._restServer;
    }
    get wss() {
        return this._wss;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._restServer.start();
                yield this._wss.start();
            }
            catch (err) {
                throw new Error(`Failed to initialize proxy server. ${err}`);
            }
        });
    }
    forwardAlexaMessages() {
        this._restServer.registerListener("post", "/", this.hanshakeHandle.bind(this));
        this._restServer.registerListener("post", "/alexa/devy", this.alexaMessageHandler.bind(this));
    }
    hanshakeHandle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            log_1.default.info("Recieved a request to /");
        });
    }
    alexaMessageHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let body = req.body;
                let user = new alexaUser_1.default(body.session.user.userId);
                let session = body.session.sessionId;
                let timedOut = false;
                log_1.default.info(`Proxy::alexaMessageHandler(...) - Got request for user ${user}.` + {
                    type: "request",
                    user: user.raw,
                    session: session,
                    method: req.method,
                    path: req.url,
                    body: req.body
                });
                if (yield this._wss.isClientReady(user)) {
                    log_1.default.info("Sending req to client");
                    let response = yield this._wss.send(user, body);
                    log_1.default.info(`Proxy::alexaMessageHandler(...) - User ${user} responding on session ${session}.` + {
                        type: "response",
                        user: user.raw,
                        session: session,
                        status: 200,
                        body: response
                    });
                    res.json(200, JSON.parse(response));
                }
                else {
                    let timeout = 8000;
                    let timer = new timer_1.default(timeout);
                    log_1.default.warn(`Proxy::alexaMessageHandler(...) - Client for user ${user} is not connected. Waiting ${timeout}ms for connection.`);
                    timer.start().then(() => {
                        timedOut = true;
                        let resp = {
                            "version": "1.0",
                            "response": {
                                "outputSpeech": {
                                    "type": "SSML",
                                    "ssml": "<speak> Sorry, I couldn't connect to your client app. Please try restarting it.  </speak>"
                                },
                                "shouldEndSession": true
                            },
                            "sessionAttributes": {}
                        };
                        log_1.default.info(`Proxy::alexaMessageHandler(...) - Client for user ${user} did not connect. Unable to process request.` + {
                            type: "response",
                            user: user.raw,
                            session: session,
                            status: 200,
                            body: resp
                        });
                        res.send(200, resp);
                    });
                    this._wss.isClientReady(user).then(() => __awaiter(this, void 0, void 0, function* () {
                        if (!timedOut) {
                            timer.cancel();
                            let response = yield this._wss.send(user, body);
                        }
                    }));
                }
            }
            catch (err) {
                log_1.default.error(`Proxy::alexaMessageHandler(...) - There was an error handling a request from Alexa.` + err);
                res.send(500, err);
            }
        });
    }
}
exports.default = Proxy;
//# sourceMappingURL=proxy.js.map