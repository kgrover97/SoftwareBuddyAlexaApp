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
const log_1 = require("./log");
const proxy_1 = require("./proxy");
let restPort = Number.parseInt(process.env.PORT) || 443;
let wssPort = Number.parseInt(process.env.WEBSOCKET_PORT) || 11500;
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let proxy = new proxy_1.default(restPort, wssPort);
            yield proxy.init();
            proxy.forwardAlexaMessages();
        }
        catch (err) {
            log_1.default.error(`Failed to initialize appication.` + err);
        }
    });
})();
//# sourceMappingURL=app.js.map