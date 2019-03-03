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
const restify = require("restify");
const log_1 = require("./log");
class RestServer {
    constructor(port) {
        this.port = port;
    }
    get server() {
        return this.rest;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((fulfill, reject) => {
                try {
                    this.rest = restify.createServer({
                        name: "devy-proxy",
                    });
                    this.rest.use(restify.plugins.bodyParser());
                    this.rest.on("error", (err) => {
                        log_1.default.warn(`RestServer::onError() - REST server encountered an error. ${err}`);
                        reject(err);
                    });
                    this.rest.listen(this.port, () => {
                        log_1.default.info(`RestServer::start() - REST server is listening at ${this.rest.url}`);
                        fulfill();
                    });
                }
                catch (err) {
                    throw new Error(`Failed to start REST server. ${err}`);
                }
            });
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((fulfill) => {
                this.rest.close(() => fulfill());
            });
        });
    }
    registerListener(verb, path, listener) {
        switch (verb.toLowerCase()) {
            case "post":
                this.rest.post(path, listener);
                break;
            default:
                throw new Error("Invalid HTTP verb.");
        }
    }
}
exports.default = RestServer;
//# sourceMappingURL=restServer.js.map