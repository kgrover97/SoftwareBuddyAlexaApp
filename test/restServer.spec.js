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
const restServer_1 = require("../src/restServer");
chai.use(chaiAsPromised);
chai.use(chaiHttp);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
describe("RestServer", () => {
    let port = 443;
    let rest;
    before(() => {
        rest = new restServer_1.default(port);
    });
    after(() => __awaiter(this, void 0, void 0, function* () {
        yield rest.stop();
    }));
    it("should start.", () => __awaiter(this, void 0, void 0, function* () {
        return chai_1.expect(rest.start()).to.be.fulfilled;
    }));
    it("should call a listener on a post event.", (done) => {
        rest.registerListener("post", "/alexa/devy", (req, res, next) => {
            res.json(200, "ok");
        });
        chai.request("https://localhost:" + port)
            .post("/alexa/devy")
            .end((err, res) => {
            chai_1.expect(err).to.be.null;
            chai_1.expect(res).to.have.status(200);
            done();
        });
    });
});
//# sourceMappingURL=restServer.spec.js.map