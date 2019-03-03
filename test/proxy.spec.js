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
const chai_1 = require("chai");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const chaiHttp = require("chai-http");
const fs = require("fs");
const WebSocket = require("ws");
const proxy_1 = require("../src/proxy");
chai.use(chaiAsPromised);
chai.use(chaiHttp);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
describe("Proxy", () => {
    let restPort = 443;
    let wssPort = 11500;
    let proxy;
    let ws;
    let host = "https://localhost:" + restPort;
    let requests = JSON.parse(fs.readFileSync("./test/sampleAlexaRequests.js", "UTF-8"));
    before(() => __awaiter(this, void 0, void 0, function* () {
        proxy = new proxy_1.default(restPort, wssPort);
        yield proxy.init();
        return proxy.forwardAlexaMessages();
    }));
    it("should forward an Alexa request if the user is connected.", function (done) {
        let request = requests[0];
        let user = request.session.user.userId;
        ws = new WebSocket("ws://localhost:" + wssPort, { headers: { "user": user } });
        ws.on("open", () => {
            ws.on("message", (data) => {
                ws.send(data);
            });
            chai.request(host)
                .post("/alexa/devy")
                .send(request)
                .end((err, res) => {
                chai_1.expect(res).to.have.status(200);
                ws.close();
                done();
            });
        });
    });
    it("should fail to  forward an Alexa request if the client isn't connected.", function (done) {
        this.timeout(10000);
        chai.request(host)
            .post("/alexa/devy")
            .send(requests[0])
            .end((err, res) => {
            chai_1.expect(res).to.have.status(500);
            done();
        });
    });
});
//# sourceMappingURL=proxy.spec.js.map